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

// Email queue class for handling bulk emails
export class EmailQueue {
  private queue: EmailData[] = [];
  private processing = false;

  add(emailData: EmailData) {
    this.queue.push(emailData);
    if (!this.processing) {
      this.process();
    }
  }

  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const emailData = this.queue.shift();
      if (emailData) {
        await this.sendEmail(emailData);
        // Delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    this.processing = false;
  }

  private async sendEmail(emailData: EmailData) {
    try {
      const transporter = createTransporter();
      
      for (const recipient of emailData.recipients) {
        await transporter.sendMail({
          from: `"${config.company.name}" <${config.gmail.user}>`,
          to: recipient,
          subject: emailData.subject,
          html: this.generateEmailHTML(emailData),
          replyTo: config.company.replyTo
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private generateEmailHTML(emailData: EmailData): string {
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
          </div>
        </div>
      </div>
    `;
  }
}