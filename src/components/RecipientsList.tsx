
import React from "react";
import SingleEmailInput from "./recipients/SingleEmailInput";
import BulkEmailInput from "./recipients/BulkEmailInput";
import FileUploadInput from "./recipients/FileUploadInput";
import RecipientsTags from "./recipients/RecipientsTags";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEmailList } from "@/utils/emailValidation";
import { AlertCircle } from "lucide-react";

interface RecipientsListProps {
  recipients: string[];
  setRecipients: React.Dispatch<React.SetStateAction<string[]>>;
}

const RecipientsList: React.FC<RecipientsListProps> = ({ recipients, setRecipients }) => {
  const [invalidEmails, setInvalidEmails] = React.useState<string[]>([]);
  
  const addRecipient = (email: string) => {
    const { valid, invalid } = validateEmailList([email]);
    
    if (valid.length > 0) {
      // Check if email already exists
      if (!recipients.includes(valid[0])) {
        setRecipients([...recipients, valid[0]]);
      }
    }
    
    setInvalidEmails(invalid);
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(e => e !== email));
  };

  const updateRecipients = (newEmails: string[]) => {
    const { valid, invalid } = validateEmailList(newEmails);
    
    // Merge with existing recipients, avoiding duplicates
    const updatedRecipients = [...recipients];
    
    valid.forEach(email => {
      if (!updatedRecipients.includes(email)) {
        updatedRecipients.push(email);
      }
    });
    
    setRecipients(updatedRecipients);
    setInvalidEmails(invalid);
  };

  const clearInvalidEmails = () => {
    setInvalidEmails([]);
  };

  return (
    <div className="space-y-6">
      {invalidEmails.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Οι παρακάτω διευθύνσεις email δεν είναι έγκυρες και παραλείφθηκαν:
            <div className="mt-2 text-sm max-h-24 overflow-y-auto">
              {invalidEmails.map((email, index) => (
                <div key={index} className="py-1 border-b border-red-200 last:border-b-0">
                  {email}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <SingleEmailInput 
        recipients={recipients} 
        addRecipient={addRecipient}
        clearInvalidEmails={clearInvalidEmails}
      />

      <BulkEmailInput 
        recipients={recipients} 
        updateRecipients={updateRecipients}
        clearInvalidEmails={clearInvalidEmails}
      />

      <FileUploadInput 
        recipients={recipients} 
        updateRecipients={updateRecipients}
        clearInvalidEmails={clearInvalidEmails}
      />

      <RecipientsTags 
        recipients={recipients} 
        removeRecipient={removeRecipient} 
      />
    </div>
  );
};

export default RecipientsList;
