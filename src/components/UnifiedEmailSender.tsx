import React, { useState } from 'react';
import AIContentGenerator from './AIContentGenerator';
import ImageUploadCard from './email/ImageUploadCard';
import EmailContentForm from './email/EmailContentForm';
import RecipientsList from './RecipientsList';
import SendEmailSection from './email/SendEmailSection';
import { OfferFormData, EmailStats } from '@/types/email';

const UnifiedEmailSender = () => {
  const [formData, setFormData] = useState<OfferFormData>({
    subject: '',
    title: '',
    description: '',
    price: '',
    cta: 'Επικοινωνήστε μαζί μας',
    recipients: ''
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  
  // Use recipients array instead of string for RecipientsList
  const [recipients, setRecipients] = useState<string[]>([]);

  // Calculate recipient count from array
  const recipientCount = recipients.length;

  const updateFormData = (field: keyof OfferFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIContent = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          📧 Αποστολή Email Προσφορών
        </h1>
        <p className="text-muted-foreground">
          Ανεβάστε την εικόνα προσφοράς σας και στείλτε την σε πολλαπλούς παραλήπτες
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageUploadCard
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          uploading={uploading}
          setUploading={setUploading}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
        />

        <EmailContentForm
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>

      <AIContentGenerator onContentGenerated={handleAIContent} />

      <RecipientsList
        recipients={recipients}
        setRecipients={setRecipients}
      />

      <SendEmailSection
        formData={{...formData, recipients: recipients}}
        uploadedImageUrl={uploadedImageUrl}
        recipientCount={recipientCount}
        sending={sending}
        setSending={setSending}
        emailStats={emailStats}
        setEmailStats={setEmailStats}
      />
    </div>
  );
};

export default UnifiedEmailSender;