import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { validateEmail, checkCommonEmailTypos } from "@/utils/emailValidation";

interface SingleEmailInputProps {
  recipients: string[];
  addRecipient: (email: string) => void;
  clearInvalidEmails: () => void;
}

const SingleEmailInput: React.FC<SingleEmailInputProps> = ({ 
  recipients, 
  addRecipient,
  clearInvalidEmails
}) => {
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    // Check for common typos
    const correctedEmail = checkCommonEmailTypos(email.trim());
    
    // Validate and add
    if (correctedEmail && validateEmail(correctedEmail)) {
      if (!recipients.includes(correctedEmail)) {
        addRecipient(correctedEmail);
        setEmail("");
      } else {
        // Email already exists
        setEmail("");
      }
    } else if (correctedEmail) {
      // Invalid email
      addRecipient(correctedEmail); // This will trigger the invalid email alert
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    clearInvalidEmails();
  };

  return (
    <div>
      <Label htmlFor="email">Προσθήκη Διεύθυνσης Email</Label>
      <div className="flex mt-1.5 gap-2">
        <Input
          id="email"
          type="email"
          placeholder="customer[at]company.gr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearInvalidEmails();
          }}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAdd}
          disabled={!email.trim()}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Προσθήκη
        </Button>
      </div>
    </div>
  );
};

export default SingleEmailInput;
