import { createTransporter } from '../services/email';
import { config } from '../config/environment';

// Email data interface
export interface EmailData {
  recipients: string[];
  subject: string;
  title: string;
  description: string;
  cta?: string;
  imageUrl?: string;
}

// Email status tracking
export interface EmailStatus {
  email: string;
  status: 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  attempts: number;
  lastTried?: Date;
  error?: string;
}

// Enhanced email queue class with robust error handling
export class EmailQueue {
  private queue: EmailData[] = [];
  private retryQueue: { emailData: EmailData; email: string; attempts: number }[] = [];
  private processing = false;
  private emailStatuses: Map<string, EmailStatus> = new Map();

  add(emailData: EmailData) {
    // Initialize status for all recipients
    emailData.recipients.forEach(email => {
      this.emailStatuses.set(email, {
        email,
        status: 'PENDING',
        attempts: 0
      });
    });
    
    this.queue.push(emailData);
    if (!this.processing) {
      this.process();
    }
  }

  getEmailStatus(email: string): EmailStatus | undefined {
    return this.emailStatuses.get(email);
  }

  getAllStatuses(): EmailStatus[] {
    return Array.from(this.emailStatuses.values());
  }

  private async process() {
    this.processing = true;
    
    // Process main queue
    while (this.queue.length > 0) {
      const emailData = this.queue.shift();
      if (emailData) {
        await this.sendEmailBatch(emailData);
        // Anti-spam rate limiting: 120 seconds (2 minutes) between batches
        if (this.queue.length > 0) {
          console.log(`⏳ Waiting 2 minutes before next batch...`);
          await new Promise(resolve => setTimeout(resolve, 120000));
        }
      }
    }
    
    // Process retry queue
    await this.processRetryQueue();
    
    this.processing = false;
  }

  private async processRetryQueue() {
    while (this.retryQueue.length > 0) {
      const retryItem = this.retryQueue.shift();
      if (retryItem && retryItem.attempts < 3) {
        console.log(`🔄 Retrying email to ${retryItem.email} (attempt ${retryItem.attempts + 1}/3)`);
        await this.sendSingleEmail(retryItem.emailData, retryItem.email, retryItem.attempts + 1);
        
        // Wait 2 minutes between retries
        if (this.retryQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 120000));
        }
      }
    }
  }

  private async sendEmailBatch(emailData: EmailData) {
    for (const recipient of emailData.recipients) {
      await this.sendSingleEmail(emailData, recipient, 0);
      
      // 2 minutes between individual emails in the same batch
      if (emailData.recipients.indexOf(recipient) < emailData.recipients.length - 1) {
        console.log(`⏳ Waiting 2 minutes before next email...`);
        await new Promise(resolve => setTimeout(resolve, 120000));
      }
    }
  }

  private async sendSingleEmail(emailData: EmailData, recipient: string, attemptNumber: number) {
    try {
      // Update status to SENDING
      this.emailStatuses.set(recipient, {
        email: recipient,
        status: attemptNumber > 0 ? 'RETRYING' : 'SENDING',
        attempts: attemptNumber + 1,
        lastTried: new Date()
      });

      const transporter = createTransporter();
      const messageId = `<${Date.now()}-${Math.random().toString(36).substr(2, 9)}@${config.gmail.user.split('@')[1]}>`;
      
      await transporter.sendMail({
        from: `"${config.company.name}" <${config.gmail.user}>`,
        to: recipient,
        subject: emailData.subject,
        html: this.generateEmailHTML(emailData, recipient),
        replyTo: config.company.replyTo,
        // Anti-spam headers
        headers: {
          'Message-ID': messageId,
          'X-Mailer': 'Professional Email Sender v1.0',
          'List-Unsubscribe': `<mailto:unsubscribe+${Buffer.from(recipient).toString('base64')}@${config.gmail.user.split('@')[1]}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'X-Auto-Response-Suppress': 'All',
          'Precedence': 'bulk'
        }
      });
      
      // Update status to SENT
      this.emailStatuses.set(recipient, {
        email: recipient,
        status: 'SENT',
        attempts: attemptNumber + 1,
        lastTried: new Date()
      });
      
      console.log(`✅ Email sent to ${recipient} at ${new Date().toISOString()} (attempt ${attemptNumber + 1})`);
      
    } catch (error) {
      console.error(`❌ Error sending email to ${recipient}:`, error);
      
      // Update status to FAILED
      this.emailStatuses.set(recipient, {
        email: recipient,
        status: 'FAILED',
        attempts: attemptNumber + 1,
        lastTried: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Add to retry queue if attempts < 3
      if (attemptNumber < 2) {
        this.retryQueue.push({
          emailData,
          email: recipient,
          attempts: attemptNumber + 1
        });
        console.log(`🔄 Added ${recipient} to retry queue (attempt ${attemptNumber + 2}/3)`);
      } else {
        console.log(`💥 Failed to send email to ${recipient} after 3 attempts`);
      }
    }
  }

  private generateEmailHTML(emailData: EmailData, recipient: string): string {
    const unsubscribeToken = Buffer.from(recipient).toString('base64');
    const unsubscribeUrl = `mailto:unsubscribe+${unsubscribeToken}@${config.gmail.user.split('@')[1]}?subject=Unsubscribe`;
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            ${emailData.title}
          </h1>
          
          ${emailData.imageUrl ? `
            <div style="text-align: center; margin: 20px 0;">
              <img src="${emailData.imageUrl}" alt="Product Image" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
            </div>
          ` : ''}
          
          <div style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
            ${emailData.description.replace(/\n/g, '<br>')}
          </div>
          
          ${emailData.cta ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${config.company.replyTo}" 
                 style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                ${emailData.cta}
              </a>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center;">
            <p><strong>${config.company.name}</strong></p>
            <p>Για περισσότερες πληροφορίες επικοινωνήστε μαζί μας</p>
            
            <!-- ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΥΠΟΓΡΑΦΗ -->
            <div style="margin-top: 20px; font-size: 14px; line-height: 1.6; text-align: left; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <strong>ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ</strong><br />
              <strong>AKROGONOS INTERNATIONAL GROUP</strong><br />
              ΧΟΝΔΡΙΚΟ ΕΜΠΟΡΙΟ - ΚΑΤΑΣΚΕΥΗ ΚΑΙ ΕΜΠΟΡΙΑ ΚΟΥΦΩΜΑΤΩΝ ΑΛΟΥΜΙΝΙΟΥ & PVC<br /><br />
              <strong>ΚΕΝΤΡΙΚΟ:</strong> ΓΕΡΩΝΥΜΑΚΗ 104, ΠΑΤΕΛΕΣ, ΗΡΑΚΛΕΙΟ ΚΡΗΤΗΣ<br />
              <strong>Τηλ:</strong> 00302811812735, 0030 2811812164<br />
              <strong>ΠΕΙΡΑΙΑΣ:</strong> ΝΟΤΑΡΑ 117, Τηλ: 6939366243 – 6907793443<br />
              <strong>Αρχική Σελίδα:</strong> <a href="https://www.energiakakoufomata-koufomatapvc.gr/" target="_blank" style="color: #3498db; text-decoration: none;">www.energiakakoufomata-koufomatapvc.gr</a><br />
              <strong>Επικοινωνία:</strong> <a href="https://www.energiakakoufomata-koufomatapvc.gr/epikoinonia/" target="_blank" style="color: #3498db; text-decoration: none;">www.energiakakoufomata-koufomatapvc.gr/epikoinonia</a>
            </div>
            
            <!-- GDPR Compliance & Unsubscribe -->
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
              <p>Λαμβάνετε αυτό το email επειδή έχετε εκδηλώσει ενδιαφέρον για τις υπηρεσίες μας.</p>
              <p>
                <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Απεγγραφή από τη λίστα</a> | 
                <a href="mailto:${config.company.replyTo}?subject=Privacy%20Policy" style="color: #666; text-decoration: underline;">Πολιτική Απορρήτου</a>
              </p>
              <p style="margin-top: 10px;">
                ${config.company.name}<br>
                Email: ${config.company.replyTo}<br>
                Email: sale@energiakakoufomata-koufomatapvc.gr
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}