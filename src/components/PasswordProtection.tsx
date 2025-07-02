import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Correct password - τα αρχικά της εταιρείας
  const CORRECT_PASSWORD = 'AIG2024';

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('aig_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('aig_auth', 'authenticated');
      setError('');
    } else {
      setError('Λάθος κωδικός πρόσβασης');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Εταιρική Πρόσβαση</CardTitle>
            <p className="text-muted-foreground">
              AKROGONOS INTERNATIONAL GROUP<br/>
              Email Marketing System
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Κωδικός Πρόσβασης</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Εισάγετε τον κωδικό"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Είσοδος
              </Button>
            </form>

            <div className="mt-6 text-xs text-center text-muted-foreground">
              <p>Πρόσβαση μόνο για εξουσιοδοτημένο προσωπικό</p>
              <p className="mt-2">🔒 Ασφαλής σύνδεση με SSL</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordProtection;