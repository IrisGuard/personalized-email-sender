import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OfferFormData } from '@/types/email';

interface EmailContentFormProps {
  formData: OfferFormData;
  updateFormData: (field: keyof OfferFormData, value: string) => void;
}

const EmailContentForm: React.FC<EmailContentFormProps> = ({
  formData,
  updateFormData,
}) => {
  const subjectOptions = [
    'Ειδική Προσφορά',
    'Νέα Προσφορά',
    'Περιορισμένη Διαθεσιμότητα',
    'Προσφορά Ημέρας',
    'Έκπτωση έως και -50%',
    'Μην τη χάσετε!'
  ];

  const titleOptions = [
    'Μοναδική προσφορά μόνο για σήμερα',
    'Ανακαλύψτε τις νέες τιμές μας',
    'Αποκλειστική προσφορά για εσάς',
    'Επωφεληθείτε τώρα – ισχύει για λίγες μέρες',
    'Έκπτωση περιορισμένου χρόνου',
    'Ισχύει μέχρι εξαντλήσεως αποθεμάτων'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Περιεχόμενο Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Θέμα Email *</Label>
          <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Επιλέξτε θέμα email" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Τίτλος Προσφοράς *</Label>
          <Select value={formData.title} onValueChange={(value) => updateFormData('title', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Επιλέξτε τίτλο προσφοράς" />
            </SelectTrigger>
            <SelectContent>
              {titleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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