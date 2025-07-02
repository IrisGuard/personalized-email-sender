import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OfferFormData } from '@/types/email';

interface EmailContentFormProps {
  formData: OfferFormData;
  updateFormData: (field: keyof OfferFormData, value: string) => void;
}

const EmailContentForm: React.FC<EmailContentFormProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Περιεχόμενο Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Θέμα Email *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            placeholder="π.χ. Ειδική Προσφορά"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Τίτλος Προσφοράς *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="π.χ. Νέα Προσφορά"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Περιγραφή</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Περιγράψτε τα χαρακτηριστικά και τα πλεονεκτήματα της προσφοράς..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Τιμή</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => updateFormData('price', e.target.value)}
              placeholder="π.χ. €100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action</Label>
            <Input
              id="cta"
              value={formData.cta}
              onChange={(e) => updateFormData('cta', e.target.value)}
              placeholder="π.χ. Επικοινωνήστε μαζί μας"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailContentForm;