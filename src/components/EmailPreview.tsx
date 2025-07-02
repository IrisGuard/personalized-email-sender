
import React from "react";
import EmailHeader from "./email/EmailHeader";
import EmailBody from "./email/EmailBody";
import EmailFooter from "./email/EmailFooter";
import { Card } from "@/components/ui/card";

interface EmailPreviewProps {
  subject: string;
  message: string;
  signature: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, message, signature }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <EmailHeader subject={subject} />
      <EmailBody message={message} signature={signature} />
      <EmailFooter />
    </div>
  );
};

export default EmailPreview;
