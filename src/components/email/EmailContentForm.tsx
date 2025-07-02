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

  const descriptionOptions = [
    {
      label: 'Μήνυμα 1 - Έτοιμο τεμάχιο σε τιμή χονδρικής...',
      value: 'Η προσφορά αφορά έτοιμο τεμάχιο σε τιμή χονδρικής. Διαθέτουμε μεγάλη ποικιλία σε πόρτες, παράθυρα, μπαλκονόπορτες και κουφώματα αλουμινίου & PVC. Καλύπτουμε όλη την Ελλάδα με άμεσες παραδόσεις. Επισκεφθείτε το site μας ή καλέστε μας για περισσότερες πληροφορίες.'
    },
    {
      label: 'Μήνυμα 2 - Εκμεταλλευτείτε την προσφορά...',
      value: 'Εκμεταλλευτείτε την προσφορά για το συγκεκριμένο τεμάχιο και δείτε ενδεικτικά τις τιμές μας. Παρέχουμε χονδρική πώληση με πανελλαδική κάλυψη. Πόρτες εισόδου, παράθυρα και ειδικές κατασκευές σε προνομιακές τιμές. Επικοινωνήστε μαζί μας για πλήρη κατάλογο.'
    },
    {
      label: 'Μήνυμα 3 - Ενδεικτική προσφορά κουφωμάτων...',
      value: 'Η συγκεκριμένη προσφορά είναι ενδεικτική των τιμών μας σε κουφώματα. Διαθέτουμε πλούσια γκάμα σε διαστάσεις, τύπους και χρώματα. Στείλτε μας μήνυμα ή καλέστε μας για να σας προτείνουμε λύσεις προσαρμοσμένες στις ανάγκες σας. Άμεση εξυπηρέτηση σε όλη την Ελλάδα.'
    },
    {
      label: 'Μήνυμα 4 - Επιλεγμένη προσφορά για επαγγελματίες...',
      value: 'Σας παρουσιάζουμε μία επιλεγμένη προσφορά. Η εταιρεία μας διαθέτει δεκάδες επιλογές για επαγγελματίες σε πόρτες, παράθυρα και άλλα κουφώματα. Δείτε το site μας για περισσότερα προϊόντα ή καλέστε μας για να λάβετε αναλυτική προσφορά. Αποστολές σε όλη την Ελλάδα.'
    },
    {
      label: 'Μήνυμα 5 - Έτοιμο για παράδοση...',
      value: 'Η προσφορά ισχύει για συγκεκριμένο τεμάχιο, έτοιμο για παράδοση. Είμαστε δίπλα στον επαγγελματία, με άμεση διαθεσιμότητα, ανταγωνιστικές τιμές και αποστολές πανελλαδικά. Μπείτε στο site μας για περισσότερες λύσεις ή καλέστε μας να σας εξυπηρετήσουμε άμεσα.'
    },
    {
      label: 'Μήνυμα 6 - Μεγάλη γκάμα κουφωμάτων χονδρικής...',
      value: 'Μία ακόμη προσφορά από τη μεγάλη γκάμα μας σε κουφώματα χονδρικής. Διαθέτουμε λύσεις για κατασκευαστές, τεχνικά γραφεία και επαγγελματίες σε όλη την Ελλάδα. Ενημερωθείτε για τις επιλογές και τις τιμές μας στο site ή τηλεφωνικά. Εξυπηρέτηση με αξιοπιστία και ταχύτητα.'
    }
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
          <div className="space-y-2">
            <Select onValueChange={(value) => updateFormData('description', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε έτοιμο μήνυμα (προαιρετικό)" />
              </SelectTrigger>
              <SelectContent>
                {descriptionOptions.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Περιγράψτε τα χαρακτηριστικά και τα πλεονεκτήματα της προσφοράς..."
              rows={4}
            />
          </div>
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