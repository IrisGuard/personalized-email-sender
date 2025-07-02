// Email related types and interfaces

export interface OfferFormData {
  subject: string;
  title: string;
  description: string;
  price: string;
  cta: string;
  recipients: string;
}

export interface EmailStats {
  success: boolean;
  message: string;
  validEmails: number;
  totalEmails: number;
  estimatedTime: string;
  imageUploaded: boolean;
}