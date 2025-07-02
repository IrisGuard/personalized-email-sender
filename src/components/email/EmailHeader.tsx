import React from "react";

interface EmailHeaderProps {
  subject: string;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({ subject }) => {
  return (
    <div className="bg-secondary p-3 border-b flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">
          Θέμα: {subject || "Η προσφορά σας από την AKROGONOS INTERNATIONAL GROUP"}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Από: AKROGONOS INTERNATIONAL GROUP &lt;koufomataxondriki@gmail.com&gt;
      </div>
    </div>
  );
};

export default EmailHeader;
