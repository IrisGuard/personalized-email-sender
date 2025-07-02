
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { processEmailBatch } from "@/utils/emailValidation";
import { Users } from "lucide-react";

interface BulkEmailInputProps {
  recipients: string[];
  updateRecipients: (emails: string[]) => void;
  clearInvalidEmails: () => void;
}

const BulkEmailInput: React.FC<BulkEmailInputProps> = ({ 
  updateRecipients,
  clearInvalidEmails
}) => {
  const [bulkEmails, setBulkEmails] = useState("");

  const handleAddBulk = () => {
    if (bulkEmails.trim()) {
      const { valid, invalid } = processEmailBatch(bulkEmails);
      updateRecipients(valid);
      
      if (valid.length > 0 && invalid.length === 0) {
        // All emails were valid, clear the textarea
        setBulkEmails("");
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Μαζική Εισαγωγή</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Εισάγετε πολλαπλές διευθύνσεις email διαχωρισμένες με κόμμα, ερωτηματικό ή νέα γραμμή"
          value={bulkEmails}
          onChange={(e) => {
            setBulkEmails(e.target.value);
            clearInvalidEmails();
          }}
          className="min-h-[100px]"
        />
        <Button 
          className="w-full mt-3" 
          variant="outline"
          onClick={handleAddBulk}
          disabled={!bulkEmails.trim()}
        >
          <Users className="mr-2 h-4 w-4" /> Προσθήκη Πολλαπλών Διευθύνσεων
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkEmailInput;
