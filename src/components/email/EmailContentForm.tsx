import React, { useState } from 'react';
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
  const [selectedProfile, setSelectedProfile] = useState('');
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
      label: 'Προσφορά Χονδρικής για Επαγγελματίες',
      value: 'Η προσφορά αφορά πώληση κουφωμάτων σε τιμή χονδρικής, ειδικά σχεδιασμένη για κατασκευαστές, εμπόρους και επαγγελματίες του κλάδου. Διαθέτουμε ευρεία γκάμα προφίλ με δυνατότητα προσαρμογής στις ανάγκες σας. Η αποστολή πραγματοποιείται πανελλαδικά. Επικοινωνήστε μαζί μας για πλήρη ενημέρωση και προσφορά.'
    },
    {
      label: 'Εισαγωγές – Εξαγωγές Κουφωμάτων PVC & Αλουμινίου',
      value: 'Δραστηριοποιούμαστε στον τομέα των κουφωμάτων με εισαγωγές και εξαγωγές υψηλής ποιότητας προφίλ. Προσφέρουμε τιμές χονδρικής και τεχνική υποστήριξη σε κάθε επαγγελματία. Στείλτε μας τις ανάγκες του έργου σας για να σας αποστείλουμε οικονομική και τεχνική προσφορά.'
    },
    {
      label: 'Πανελλαδική Παράδοση – Χονδρικές Τιμές',
      value: 'Προσφέρουμε κουφώματα με πανελλαδική αποστολή και ευέλικτη εξυπηρέτηση B2B. Η τιμή διαμορφώνεται σύμφωνα με τις απαιτήσεις και τις ποσότητες. Στείλτε μας τα στοιχεία σας για να συντάξουμε ακριβή προσφορά και να ξεκινήσουμε τη συνεργασία μας.'
    },
    {
      label: 'Συνεργασία με Επαγγελματίες Καταστημάτων Κουφωμάτων',
      value: 'Η προσφορά αφορά επαγγελματίες του χώρου όπως αλουμινάδες, καταστήματα κουφωμάτων και εμπορικά σημεία που δραστηριοποιούνται σε PVC & Αλουμίνιο. Παρέχουμε τιμές χονδρικής, μεγάλη ποικιλία προφίλ και δυνατότητα επιλογής ανά τύπο κατασκευής. Η αποστολή γίνεται πανελλαδικά.'
    },
    {
      label: 'Επιλογή για Καταστήματα & Τεχνικά Έργα',
      value: 'Διαθέτουμε κουφώματα κατάλληλα για κάθε επαγγελματία του χώρου – από τοπικά καταστήματα μέχρι μεγάλους προμηθευτές. Οι τιμές μας είναι προσαρμοσμένες για τη χονδρική αγορά και παρέχουμε λεπτομερείς τεχνικές πληροφορίες, δείγματα και υποστήριξη για τη σωστή επιλογή προϊόντος.'
    },
    {
      label: 'Τεχνικά Προϊόντα για Εμπόρους & Αλουμινάδες',
      value: 'Το προϊόν αυτό απευθύνεται σε επαγγελματίες του χώρου κουφωμάτων που αναζητούν αξιόπιστες λύσεις σε ανταγωνιστικές τιμές. Κατάλληλο για εμπορική διάθεση ή ενσωμάτωση σε τεχνικά έργα, συνοδεύεται από σαφή τεχνικά χαρακτηριστικά και υποστήριξη για κάθε στάδιο της παραγγελίας.'
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
        {/* Removed Θέμα Email and Τίτλος Προσφοράς for spam-free optimization */}

        <div className="space-y-2">
          <Label htmlFor="description">Επαγγελματική Περιγραφή</Label>
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
              placeholder="Επαγγελματική περιγραφή για B2B συνεργασίες και χονδρική πώληση..."
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile">Περιγραφή Προφίλ Κουφώματος (Προαιρετικό)</Label>
          <div className="space-y-2">
            <Select onValueChange={(value) => {
              setSelectedProfile(value);
              updateFormData('description', formData.description + '\n\n' + value);
            }}>
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
            {selectedProfile && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Επιλεγμένη Περιγραφή Προφίλ:
                </Label>
                <Textarea
                  value={selectedProfile}
                  onChange={(e) => {
                    setSelectedProfile(e.target.value);
                    // Update the main description by replacing the old profile text with new one
                    const descWithoutProfile = formData.description.replace(selectedProfile, '');
                    updateFormData('description', descWithoutProfile + '\n\n' + e.target.value);
                  }}
                  rows={6}
                  className="text-sm"
                />
              </div>
            )}
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
              placeholder="π.χ. Περισσότερες Πληροφορίες"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailContentForm;