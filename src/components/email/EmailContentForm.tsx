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
      label: 'Προσφορά έτοιμου τεμαχίου σε τιμή χονδρικής',
      value: 'Η προσφορά αφορά έτοιμο τεμάχιο σε τιμή χονδρικής, ιδανικό για άμεση παράδοση. Προτείνουμε επικοινωνία για περισσότερες λεπτομέρειες σχετικά με διαστάσεις, χρώματα και τεχνικές προδιαγραφές.'
    },
    {
      label: 'Εκμετάλλευση προσφοράς συγκεκριμένου τεμαχίου',
      value: 'Εκμεταλλευτείτε την προσφορά για το συγκεκριμένο τεμάχιο που παρουσιάζουμε σε ανταγωνιστική τιμή. Η προσφορά περιλαμβάνει όλες τις απαραίτητες λεπτομέρειες για την αξιολόγησή της από την πλευρά σας.'
    },
    {
      label: 'Ενδεικτική προσφορά τιμών μας',
      value: 'Η συγκεκριμένη προσφορά είναι ενδεικτική των τιμών μας και της ποιότητας που προσφέρουμε. Για περισσότερες πληροφορίες και προσαρμογές στις ανάγκες σας, επικοινωνήστε μαζί μας.'
    },
    {
      label: 'Επιλεγμένη προσφορά από τη γκάμα μας',
      value: 'Σας παρουσιάζουμε μία επιλεγμένη προσφορά από τη μεγάλη γκάμα προϊόντων μας. Η τιμή και τα χαρακτηριστικά που βλέπετε αντικατοπτρίζουν την ποιότητα και την αξία που προσφέρουμε.'
    },
    {
      label: 'Προσφορά έτοιμου τεμαχίου για παράδοση',
      value: 'Η προσφορά ισχύει για συγκεκριμένο τεμάχιο, έτοιμο για παράδοση. Οι διαστάσεις, το χρώμα και οι προδιαγραφές φαίνονται στην εικόνα που συνοδεύει την προσφορά.'
    },
    {
      label: 'Ακόμη μία προσφορά από τη μεγάλη γκάμα μας',
      value: 'Μία ακόμη προσφορά από τη μεγάλη γκάμα μας, σχεδιασμένη να καλύψει τις ανάγκες σας σε ανταγωνιστικές τιμές. Για περισσότερες επιλογές, επικοινωνήστε μαζί μας.'
    }
  ];

  const profileOptions = [
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
          <Label htmlFor="description">Περιγραφή Προσφοράς</Label>
          <div className="space-y-2">
            <Select onValueChange={(value) => updateFormData('description', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε έτοιμη περιγραφή (προαιρετικό)" />
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

        <div className="space-y-2">
          <Label htmlFor="profile">Περιγραφή Προφίλ Κουφώματος (Προαιρετικό)</Label>
          <div className="space-y-2">
            <Select onValueChange={(value) => updateFormData('description', formData.description + '\n\n' + value)}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε προφίλ κουφώματος για προσθήκη" />
              </SelectTrigger>
              <SelectContent>
                {profileOptions.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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