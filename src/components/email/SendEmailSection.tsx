import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OfferFormData, EmailStats } from '@/types/email';
import { API_BASE_URL } from '@/utils/api';

interface SendEmailSectionProps {
  formData: OfferFormData;
  uploadedImageUrl: string;
  recipientCount: number;
  sending: boolean;
  setSending: (sending: boolean) => void;
  emailStats: EmailStats | null;
  setEmailStats: (stats: EmailStats | null) => void;
}

const SendEmailSection: React.FC<SendEmailSectionProps> = ({
  formData,
  uploadedImageUrl,
  recipientCount,
  sending,
  setSending,
  emailStats,
  setEmailStats,
}) => {
  const { toast } = useToast();

  const sendEmails = async () => {
    console.log('🚀 SendEmails called with formData:', formData);
    console.log('📨 Recipients count:', recipientCount);
    console.log('🖼️ Image URL:', uploadedImageUrl);
    
    // Validation
    if (!uploadedImageUrl) {
      toast({
        title: 'Λείπει εικόνα',
        description: 'Παρακαλώ ανεβάστε πρώτα την εικόνα προσφοράς',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.subject.trim() || !formData.title.trim()) {
      toast({
        title: 'Ελλιπή στοιχεία',
        description: 'Παρακαλώ συμπληρώστε θέμα και τίτλο',
        variant: 'destructive',
      });
      return;
    }

    const recipients = formData.recipients
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email);

    if (recipients.length === 0) {
      toast({
        title: 'Λείπουν παραλήπτες',
        description: 'Παρακαλώ εισάγετε τουλάχιστον ένα email παραλήπτη',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      console.log('📡 Making API call to:', `${API_BASE_URL}/send-offer-emails`);
      console.log('📦 Request payload:', {
        ...formData,
        recipients,
        imageUrl: uploadedImageUrl,
      });
      
      const response = await fetch(`${API_BASE_URL}/send-offer-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recipients,
          imageUrl: uploadedImageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailStats(data);
        toast({
          title: 'Emails στάλθηκαν ΑΜΕΣΩΣ! 🚀',
          description: `${data.validEmails} emails στάλθηκαν γρήγορα! ΧΩΡΙΣ ΚΑΘΥΣΤΕΡΗΣΕΙΣ`,
        });
      } else {
        throw new Error(data.error || 'Send failed');
      }
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: 'Σφάλμα αποστολής',
        description: error instanceof Error ? error.message : 'Αποτυχία αποστολής emails',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {emailStats && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Επιτυχής υποβολή!</strong> {emailStats.validEmails} από {emailStats.totalEmails} emails 
            προστέθηκαν στην ουρά. Εκτιμώμενος χρόνος αποστολής: {emailStats.estimatedTime}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Button
              onClick={sendEmails}
              disabled={sending || !uploadedImageUrl || recipientCount === 0}
              className="w-full max-w-md mx-auto flex items-center gap-2 text-lg py-6"
              size="lg"
            >
              <Send className="h-5 w-5" />
              {sending ? 'Προσθήκη στην ουρά...' : `Αποστολή σε ${recipientCount} παραλήπτες`}
            </Button>
            
            {sending && (
              <div className="space-y-2">
                <Progress value={50} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">Προσθήκη emails στην ουρά αποστολής...</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground max-w-md mx-auto">
              <p>⚡ Τα emails θα αποσταλούν με 2 λεπτά καθυστέρηση ανά email για anti-spam προστασία</p>
              <p>🛡️ Περιλαμβάνει unsubscribe link και anti-spam headers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SendEmailSection;