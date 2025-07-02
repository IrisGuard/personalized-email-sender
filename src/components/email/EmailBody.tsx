import React from "react";
import { formatMessage } from "@/utils/emailFormatters";

interface EmailBodyProps {
  message: string;
  signature: string;
}

const EmailBody: React.FC<EmailBodyProps> = ({ message, signature }) => {
  const formattedMessage = formatMessage(message);
  
  // Προσθήκη του μπλε πλαισίου πληροφοριών
  const importantInfo = `
    <div style="background-color: #f0f4ff; border: 1px solid #d0d8ff; border-radius: 4px; padding: 12px; margin: 16px 0;">
      <strong style="color: #3b5bdb;">Σημαντική σημείωση:</strong>
      <p style="color: #4263eb; margin: 6px 0 0 0; font-size: 14px;">
        Τα emails αποστέλλονται από το επίσημο εταιρικό email. Αυτό βοηθά στην αποφυγή των spam filters και στη διατήρηση του επαγγελματικού email καθαρό.
      </p>
    </div>
  `;
  
  // Προσθήκη του footer note για την απάντηση των πελατών
  const footerNote = `<p style="color: #555; font-size: 0.9em; margin-top: 16px; border-top: 1px solid #eee; padding-top: 16px;">
    📬 Για οποιαδήποτε απορία ή επικοινωνία, παρακαλούμε απαντήστε στο email αποστολέα.
  </p>`;
  
  return (
    <div className="bg-card p-5">
      <div className="email-preview">
        <div style={{ fontFamily: 'Arial, sans-serif' }} className="space-y-4">
          <p>Αγαπητέ συνεργάτη,</p>
          <div dangerouslySetInnerHTML={{ __html: formattedMessage }} className="text-gray-800" />
          <div dangerouslySetInnerHTML={{ __html: importantInfo }} />
          <div dangerouslySetInnerHTML={{ __html: footerNote }} />
          <div className="mt-6 border-t pt-4" dangerouslySetInnerHTML={{ __html: signature }} />
        </div>
      </div>
    </div>
  );
};

export default EmailBody;
