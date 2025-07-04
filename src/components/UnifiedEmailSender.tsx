import React, { useState } from 'react';
import ImageUploadCard from './email/ImageUploadCard';
import ImageSelector from './email/ImageSelector';
import EmailContentForm from './email/EmailContentForm';
import RecipientsList from './RecipientsList';
import SendEmailSection from './email/SendEmailSection';
import { OfferFormData, EmailStats } from '@/types/email';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UnifiedEmailSender = () => {
  const [formData, setFormData] = useState<OfferFormData>({
    description: '',
    price: '',
    cta: 'Περισσότερες Πληροφορίες',
    recipients: ''
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [selectedStoredImageIds, setSelectedStoredImageIds] = useState<string[]>([]);
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
          Επιλέξτε εικόνες από την βιβλιοθήκη σας ή ανεβάστε νέες για να στείλετε σε πολλαπλούς παραλήπτες
        </p>
        <div className="mt-4">
          <a 
            href="/image-manager" 
            className="text-primary hover:underline text-sm font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Διαχείριση Αποθηκευμένων Εικόνων →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="stored" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stored">📚 Stored Images</TabsTrigger>
              <TabsTrigger value="upload">⬆️ Upload New</TabsTrigger>
            </TabsList>
            <TabsContent value="stored">
              <ImageSelector
                selectedImages={selectedStoredImageIds}
                onSelectionChange={setSelectedStoredImageIds}
              />
            </TabsContent>
            <TabsContent value="upload">
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
            </TabsContent>
          </Tabs>
        </div>

        <EmailContentForm
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>

      

      <RecipientsList
        recipients={recipients}
        setRecipients={setRecipients}
      />

      <SendEmailSection
        formData={{...formData, recipients: recipients}}
        uploadedImageUrl={uploadedImageUrl}
        selectedStoredImageIds={selectedStoredImageIds}
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