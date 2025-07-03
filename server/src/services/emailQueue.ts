// Gmail transporter removed - SendGrid only
import { sendGridService } from '../services/sendgrid';
import { config } from '../config/environment';
import { EmailData, EmailStatus, RetryQueueItem } from '../types/email';
import { EmailTemplate } from './emailTemplate';

// Enhanced email queue class with robust error handling
export class EmailQueue {
  private queue: EmailData[] = [];
  private retryQueue: RetryQueueItem[] = [];
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
        // SendGrid optimized rate limiting: 60 seconds between batches
        if (this.queue.length > 0) {
          console.log(`⏳ Waiting 1 minute before next batch...`);
          await this.delay(60000);
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
        
        // Wait 1 minute between retries
        if (this.retryQueue.length > 0) {
          await this.delay(60000);
        }
      }
    }
  }

  private async sendEmailBatch(emailData: EmailData) {
    for (const recipient of emailData.recipients) {
      await this.sendSingleEmail(emailData, recipient, 0);
      
      // 30 seconds between individual emails in the same batch (SendGrid optimized)
      if (emailData.recipients.indexOf(recipient) < emailData.recipients.length - 1) {
        console.log(`⏳ Waiting 30 seconds before next email...`);
        await this.delay(30000);
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

      // SendGrid ONLY - no fallback to prevent spam blocking
      if (!config.sendgrid.apiKey) {
        throw new Error('SendGrid API key not configured - email sending disabled for safety');
      }

      await sendGridService.sendEmail({
        to: recipient,
        subject: emailData.subject,
        html: EmailTemplate.generateHTML(emailData, recipient),
        from: `"${config.company.name}" <${config.company.senderEmail}>`,
        replyTo: config.company.replyTo
      });
      console.log(`✅ Email sent via SendGrid to ${recipient} at ${new Date().toISOString()}`);
      
      // Update status to SENT
      this.emailStatuses.set(recipient, {
        email: recipient,
        status: 'SENT',
        attempts: attemptNumber + 1,
        lastTried: new Date()
      });
      
      console.log(`✅ Email delivery confirmed for ${recipient} (attempt ${attemptNumber + 1})`);
      
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}