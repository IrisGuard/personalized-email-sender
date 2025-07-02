import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SenderConfigForm from "./smtp/SenderConfigForm";

interface SMTPConfigProps {
  senderName: string;
  setSenderName: React.Dispatch<React.SetStateAction<string>>;
}

const SMTPConfig: React.FC<SMTPConfigProps> = ({ senderName, setSenderName }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ρυθμίσεις Αποστολέα</CardTitle>
        </CardHeader>
        <CardContent>
          <SenderConfigForm 
            senderName={senderName}
            setSenderName={setSenderName}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SMTPConfig;
