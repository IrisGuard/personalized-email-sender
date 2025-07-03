import sgMail from '@sendgrid/mail';
import { config } from '../config/environment';

export class SendGridService {
  constructor() {
    if (config.sendgrid.apiKey) {
      sgMail.setApiKey(config.sendgrid.apiKey);
    }
  }

  async sendEmail({
    to,
    subject,
    html,
    from,
    replyTo
  }: {
    to: string;
    subject: string;
    html: string;
    from: string;
    replyTo?: string;
  }) {
    const msg = {
      to,
      from,
      subject,
      html,
      replyTo,
      // Anti-spam headers
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe+${Buffer.from(to).toString('base64')}@${from.split('@')[1]}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'bulk'
      },
      // SendGrid specific settings for better deliverability
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        }
      }
    };

    return await sgMail.send(msg);
  }
}

export const sendGridService = new SendGridService();