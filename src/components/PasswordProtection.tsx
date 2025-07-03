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
    console.log('🔒 PasswordProtection: Checking authentication...');
    
    // Check if already authenticated
    const auth = localStorage.getItem('aig_auth');
    const authTime = localStorage.getItem('aig_auth_time');
    
    if (auth === 'authenticated' && authTime) {
      // Check if session is still valid (24 hours)
      const sessionAge = Date.now() - parseInt(authTime);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxAge) {
        console.log('🔒 Valid session found, authenticating user');
        setIsAuthenticated(true);
      } else {
        console.log('🔒 Session expired, clearing auth');
        localStorage.removeItem('aig_auth');
        localStorage.removeItem('aig_auth_time');
      }
    }
    
    setLoading(false);
    console.log('🔒 Authentication check complete');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔒 Login attempt with password');
    
    if (password === CORRECT_PASSWORD) {
      console.log('🔒 ✅ CORRECT PASSWORD - GRANTING ACCESS');
      setIsAuthenticated(true);
      localStorage.setItem('aig_auth', 'authenticated');
      localStorage.setItem('aig_auth_time', Date.now().toString());
      setError('');
      
      // Force a page refresh to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      console.log('🔒 ❌ INVALID PASSWORD ATTEMPT');
      setError('Λάθος κωδικός πρόσβασης - Μόνο εξουσιοδοτημένο προσωπικό');
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