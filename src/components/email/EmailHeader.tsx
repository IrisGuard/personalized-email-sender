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
        <span 
          style={{ pointerEvents: 'none', color: 'inherit' }}
          data-auto-link="false"
          data-apple-data-detectors="false"
        >
          Από: AKROGONOS INTERNATIONAL GROUP &lt;noreply[at]offerakrogonosinternationalgroup.eu&gt;
        </span>
      </div>
    </div>
  );
};

export default EmailHeader;
