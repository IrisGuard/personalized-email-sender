import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { OfferFormData } from '@/types/email';

interface RecipientsInputProps {
  formData: OfferFormData;
  updateFormData: (field: keyof OfferFormData, value: string) => void;
  recipientCount: number;
}

const RecipientsInput: React.FC<RecipientsInputProps> = ({
  formData,
  updateFormData,
  recipientCount,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Παραλήπτες Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipients">Email Addresses</Label>
          <Textarea
            id="recipients"
            value={formData.recipients}
            onChange={(e) => updateFormData('recipients', e.target.value)}
            placeholder="Εισάγετε emails, ένα ανά γραμμή ή χωρισμένα με κόμματα:&#10;customer1@company.gr&#10;customer2@company.gr&#10;customer3@company.gr"
            rows={8}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">
              Έγκυρα emails: {recipientCount}
            </span>
          </div>
          {recipientCount > 0 && (
            <span className="text-primary text-sm">
              Εκτιμώμενος χρόνος: ~{recipientCount} λεπτά (1 λεπτό/email)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipientsInput;