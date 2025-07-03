// Production email service - Backend SMTP only
// All emails sent through server backend with Gmail SMTP

interface SendEmailProps {
  recipients: string[];
  subject: string;
  message: string;
  signature: string;
  trackOpens: boolean;
  trackClicks: boolean;
  senderName: string;
  onProgress: (progress: number) => void;
}

interface EmailResult {
  success: number;
  failed: number;
  errors: string[];
}

// Email form data interface for components
export interface EmailFormData {
  subject: string;
  message: string;
  signature: string;
  senderName: string;
  trackOpens: boolean;
  trackClicks: boolean;
  deliverySpeed: string;
}

// Use centralized API configuration
import { API_BASE_URL } from './api';

export const sendEmails = async ({
  recipients,
  subject,
  message,
  signature,
  trackOpens,
  trackClicks,
  senderName,
  onProgress
}: SendEmailProps): Promise<EmailResult> => {
  try {
    onProgress(10); // Έναρξη αποστολής

    // Δημιουργία του email content
    const emailContent = {
      recipients,
      subject,
      title: subject,
      description: `${message}\n\n${signature}`,
      price: '', // This service doesn't use price field
      cta: 'Επικοινωνήστε μαζί μας'
    };

    onProgress(30); // Προετοιμασία δεδομένων

    // Αποστολή στο backend - ΠΡΑΓΜΑΤΙΚΗ ΑΠΟΣΤΟΛΗ
    const response = await fetch(`${API_BASE_URL}/send-offer-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    onProgress(60); // Αναμονή απάντησης

    const data = await response.json();

    if (data.success) {
      onProgress(100); // Ολοκλήρωση
      
      return {
        success: data.validEmails || recipients.length,
        failed: data.totalEmails - data.validEmails || 0,
        errors: []
      };
    } else {
      throw new Error(data.error || 'Email sending failed');
    }
  } catch (error: any) {
    console.error("Σφάλμα αποστολής:", error);
    onProgress(0); // Reset σε σφάλμα
    return {
      success: 0,
      failed: recipients.length,
      errors: [error?.message || "Άγνωστο σφάλμα"]
    };
  }
};

// Production SMTP Configuration
export const getEmailJSConfig = () => ({
  serviceId: 'gmail-smtp',
  templateId: 'akrogonos-template',
  publicKey: 'production-ready',
  senderEmail: 'koufomataxondriki@gmail.com',
  replyToEmail: 'koufomataxondriki@gmail.com',
  companyName: 'AKROGONOS INTERNATIONAL GROUP'
});
