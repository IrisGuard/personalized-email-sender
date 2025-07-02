
import React from "react";
import { X, Check, AlertCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateEmailDetailed, EmailValidationResult } from "@/utils/emailValidation";

interface RecipientsTagsProps {
  recipients: string[];
  removeRecipient: (email: string) => void;
}

const RecipientsTags: React.FC<RecipientsTagsProps> = ({ recipients, removeRecipient }) => {
  // Validate all emails and categorize them
  const validatedEmails = recipients.map(email => validateEmailDetailed(email));
  const validEmails = validatedEmails.filter(result => result.isValid);
  const invalidEmails = validatedEmails.filter(result => !result.isValid);

  const removeAllInvalid = () => {
    invalidEmails.forEach(result => removeRecipient(result.email));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>
          Παραλήπτες: {validEmails.length} έγκυρα ✔️
          {invalidEmails.length > 0 && (
            <span className="text-destructive ml-2">
              {invalidEmails.length} άκυρα ❌
            </span>
          )}
        </Label>
        
        {invalidEmails.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAllInvalid}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Διαγραφή Άκυρων
          </Button>
        )}
      </div>

      {recipients.length === 0 ? (
        <p className="text-muted-foreground text-sm mt-2">
          Δεν έχουν προστεθεί ακόμα παραλήπτες
        </p>
      ) : (
        <div className="mt-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {validatedEmails.map((result) => (
              <div
                key={result.email}
                className={`rounded-full px-3 py-1 text-sm flex items-center ${
                  result.isValid
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {result.isValid ? (
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span className="mr-2">{result.email}</span>
                <button
                  onClick={() => removeRecipient(result.email)}
                  className={`hover:opacity-70 ${
                    result.isValid ? 'text-green-600' : 'text-red-600'
                  }`}
                  aria-label={`Remove ${result.email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          {recipients.length > 0 && (
            <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
              Σύνολο: {recipients.length} emails
              <span className="text-green-600 ml-2">✔️ {validEmails.length} έγκυρα</span>
              {invalidEmails.length > 0 && (
                <span className="text-red-600 ml-2">❌ {invalidEmails.length} άκυρα</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipientsTags;
