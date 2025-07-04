// Email data interface
export interface EmailData {
  recipients: string[];
  subject: string;
  title: string;
  description: string;
  price?: string;
  cta?: string;
  imageUrl?: string;
  storedImages?: string[];
}

// Email status tracking
export interface EmailStatus {
  email: string;
  status: 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  attempts: number;
  lastTried?: Date;
  error?: string;
}

// Retry queue item interface
export interface RetryQueueItem {
  emailData: EmailData;
  email: string;
  attempts: number;
}