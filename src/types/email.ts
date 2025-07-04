// Email related types and interfaces

export interface OfferFormData {
  description: string;
  price: string;
  cta: string;
  recipients: string | string[];
}

export interface EmailStats {
  success: boolean;
  message: string;
  validEmails: number;
  totalEmails: number;
  estimatedTime: string;
  imageUploaded: boolean;
}