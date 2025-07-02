
import React from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface RecipientsTagsProps {
  recipients: string[];
  removeRecipient: (email: string) => void;
}

const RecipientsTags: React.FC<RecipientsTagsProps> = ({ recipients, removeRecipient }) => {
  return (
    <div>
      <Label>Τρέχοντες Παραλήπτες ({recipients.length})</Label>
      {recipients.length === 0 ? (
        <p className="text-muted-foreground text-sm mt-2">
          Δεν έχουν προστεθεί ακόμα παραλήπτες
        </p>
      ) : (
        <div className="mt-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {recipients.map((email) => (
              <div
                key={email}
                className="bg-secondary rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="mr-1">{email}</span>
                <button
                  onClick={() => removeRecipient(email)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientsTags;
