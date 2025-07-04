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
    // Generate unique message ID for better deliverability
    const messageId = `${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${from.split('@')[1]}`;
    const currentDate = new Date().toUTCString();
    
    const msg = {
      to,
      from,
      subject,
      html,
      replyTo,
      // Professional email headers for maximum deliverability
      headers: {
        'Message-ID': messageId,
        'Date': currentDate,
        'List-Unsubscribe': `<mailto:unsubscribe+${Buffer.from(to).toString('base64')}@offerakrogonosinternationalgroup.eu>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Mailer': 'AKROGONOS-EmailSystem-v1.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Return-Path': from,
        'Errors-To': from,
        'X-Original-Sender': from,
        'X-SenderScore': 'Verified',
        'X-Authenticated-Sender': from
      },
      // SendGrid specific settings for better deliverability
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        },
        subscriptionTracking: {
          enable: false
        }
      },
      // Additional SendGrid settings for professional delivery
      mailSettings: {
        sandboxMode: {
          enable: false
        },
        bypassListManagement: {
          enable: false
        }
      }
    };

    return await sgMail.send(msg);
  }
}

export const sendGridService = new SendGridService();