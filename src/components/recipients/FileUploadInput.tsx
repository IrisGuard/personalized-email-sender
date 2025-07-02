
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { processEmailBatch } from "@/utils/emailValidation";

interface FileUploadInputProps {
  recipients: string[];
  updateRecipients: (emails: string[]) => void;
  clearInvalidEmails: () => void;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ 
  updateRecipients,
  clearInvalidEmails
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{name: string, count: number} | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearInvalidEmails();
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setFileInfo(null);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const { valid } = processEmailBatch(content);
        
        updateRecipients(valid);
        setFileInfo({
          name: file.name,
          count: valid.length
        });
      } catch (error) {
        console.error("Σφάλμα ανάγνωσης αρχείου:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      console.error("Σφάλμα ανάγνωσης αρχείου");
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
    
    // Reset the input value so the same file can be uploaded again
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Εισαγωγή από Αρχείο</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full relative"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Επεξεργασία...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" /> 
                  Επιλογή Αρχείου
                </>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </Button>
          </div>
          
          {fileInfo && (
            <div className="bg-muted/50 rounded p-3 text-sm flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p><strong>{fileInfo.name}</strong></p>
                <p className="text-muted-foreground mt-1">
                  Βρέθηκαν {fileInfo.count} έγκυρες διευθύνσεις email
                </p>
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground text-xs mt-1">
            Υποστηριζόμενες μορφές αρχείων: .txt, .csv (με διαχωριστικά κόμμα, ερωτηματικό ή νέα γραμμή)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadInput;
