import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ onContentGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState("promo");
  const [targetAudience, setTargetAudience] = useState("aluminium");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Κενή οδηγία",
        description: "Παρακαλώ εισάγετε μια οδηγία για την παραγωγή περιεχομένου",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate content based on user input and business context
      let generatedContent = "";
      
      const companyInfo = `AKROGONOS INTERNATIONAL GROUP - ΚΟΥΦΩΜΑΤΑ ΑΛΟΥΜΙΝΙΟΥ & PVC`;
      const baseGreeting = `Αγαπητοί συνεργάτες,\n\n`;
      
      if (emailType === "promo") {
        generatedContent = baseGreeting + `Επιχειρηματική προσφορά ${companyInfo}

Βάσει των αναγκών σας για κουφώματα αλουμινίου και PVC, θα θέλαμε να σας παρουσιάσουμε την προσφορά μας.

${prompt || 'Παρουσιάζουμε εξειδικευμένες λύσεις κουφωμάτων που ανταποκρίνονται στις ανάγκες σας.'}

Τα προϊόντα μας περιλαμβάνουν:
• Κουφώματα αλουμινίου υψηλής ποιότητας
• Συστήματα PVC με πιστοποιήσεις
• Ενεργειακά κουφώματα
• Εξειδικευμένες κατασκευές

Επικοινωνήστε μαζί μας για λεπτομερή προσφορά.`;
      } else if (emailType === "info") {
        generatedContent = baseGreeting + `Ενημέρωση από ${companyInfo}

${prompt || 'Σας ενημερώνουμε για τα νέα προϊόντα και υπηρεσίες μας στον τομέα των κουφωμάτων.'}

Νέα προϊόντα και υπηρεσίες:
• Ενεργειακά κουφώματα νέας τεχνολογίας
• Συστήματα ασφαλείας για κουφώματα
• Εξειδικευμένες εγκαταστάσεις
• Τεχνική υποστήριξη και συντήρηση

Διαθέτουμε πλήρη γκάμα προϊόντων για κάθε ανάγκη.`;
      } else {
        generatedContent = baseGreeting + `Συνέχεια επικοινωνίας - ${companyInfo}

${prompt || 'Επικοινωνούμε σε συνέχεια της προηγούμενης επικοινωνίας μας για τα κουφώματα.'}

Παραμένουμε στη διάθεσή σας για:
• Τεχνική συμβουλή και υποστήριξη
• Λεπτομερή κοστολόγηση
• Προγραμματισμό εργασιών
• Παρακολούθηση έργου

Μπορείτε να επικοινωνήσετε μαζί μας για οποιαδήποτε διευκρίνιση.`;
      }
      
      onContentGenerated(generatedContent);
      
      toast({
        title: "Επιτυχής δημιουργία",
        description: "Το περιεχόμενο δημιουργήθηκε με επιτυχία",
      });
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά τη δημιουργία του περιεχομένου",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Δημιουργία Περιεχομένου με AI</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emailType">Τύπος Email</Label>
            <Select value={emailType} onValueChange={setEmailType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Προωθητικό</SelectItem>
                <SelectItem value="info">Ενημερωτικό</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="targetAudience">Κοινό-Στόχος</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminium">Αλουμινάδες</SelectItem>
                <SelectItem value="construction">Κατασκευαστικές</SelectItem>
                <SelectItem value="contractor">Εργολάβοι</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="prompt">Οδηγίες για το AI</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Περιγράψτε το email που θέλετε να δημιουργήσετε..."
            className="min-h-[120px] mt-1.5"
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Δημιουργία...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Δημιουργία Περιεχομένου
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIContentGenerator;
