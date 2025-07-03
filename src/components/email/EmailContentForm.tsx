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
      label: 'KMG-60 (4 θαλάμων) - Προηγμένη θερμομόνωση',
      value: 'Το προφίλ KMG 60 με 4 θαλάμους μειώνει τις θερμικές απώλειες έως 37%, επιβεβαιωμένο από το ανεξάρτητο εργαστήριο ift Rosenheim. Προσφέρει υψηλή θερμομόνωση και αντοχή σε υγρασία, αέρα, UV και περιβαλλοντικές επιδράσεις. Σε συνδυασμό με τζάμια τεσσάρων εποχών, εξασφαλίζει άνεση και οικονομία για επαγγελματικά ή οικιακά έργα με απαιτητικές προδιαγραφές.'
    },
    {
      label: 'KMG-70 (6 θαλάμων) - Ανώτερη ενεργειακή απόδοση',
      value: 'Το σύστημα KMG 70 με 6 θαλάμους ενισχύει περαιτέρω τη θερμομόνωση και ηχομόνωση. Δοκιμές από το ift Rosenheim επιβεβαιώνουν υψηλά επίπεδα συμπιεστότητας και αντίστασης σε θερμότητα. Διαθέτει ειδικά κανάλια αποστράγγισης, ισχυρή προστασία από υγρασία, αέρα, σκόνη και UV. Σχεδιασμένο για επαγγελματικές εφαρμογές, παρέχει αντοχή, αισθητική και αξιοπιστία σε κάθε περιβάλλον.'
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
          <Label htmlFor="description">Περιγραφή Προφίλ Κουφώματος</Label>
          <div className="space-y-2">
            <Select onValueChange={(value) => updateFormData('description', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε προφίλ κουφώματος (προαιρετικό)" />
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