import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SenderConfigFormProps {
  senderName: string;
  setSenderName: (value: string) => void;
}

const SenderConfigForm: React.FC<SenderConfigFormProps> = ({ 
  senderName, 
  setSenderName
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="senderName">Όνομα Αποστολέα</Label>
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Όνομα Εταιρείας"
          />
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>📧 Email Configuration:</strong> Τα emails αποστέλλονται μέσω Gmail SMTP από το εταιρικό email
        </p>
      </div>
    </div>
  );
};

export default SenderConfigForm;
