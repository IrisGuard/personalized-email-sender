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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Correct credentials
  const CORRECT_USERNAME = 'haris77';
  const CORRECT_PASSWORD = 'AIG2024';

  useEffect(() => {
    console.log('🔒 PasswordProtection: NO PERSISTENT SESSION - FRESH LOGIN REQUIRED');
    
    // SECURITY: No localStorage check - always require fresh login
    // Clear any existing auth data to ensure clean state
    localStorage.removeItem('aig_auth');
    localStorage.removeItem('aig_auth_time');
    
    setLoading(false);
    console.log('🔒 MAXIMUM SECURITY: Fresh authentication required every time');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔒 Login attempt with username and password');
    
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      console.log('🔒 ✅ CORRECT CREDENTIALS - SESSION-ONLY ACCESS GRANTED');
      setIsAuthenticated(true);
      setError('');
      
      // NO localStorage - session only for this tab/window
      console.log('🔒 SECURITY: No persistent storage - logout on tab close');
    } else {
      console.log('🔒 ❌ INVALID CREDENTIALS ATTEMPT');
      setError('Λάθος όνομα χρήστη ή κωδικός πρόσβασης - Μόνο εξουσιοδοτημένο προσωπικό');
      setUsername('');
      setPassword('');
    }
  };

  // Add logout function to pass to children
  const logout = () => {
    console.log('🔒 LOGOUT: Clearing authentication state');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('aig_auth');
    localStorage.removeItem('aig_auth_time');
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
                <Label htmlFor="username">Όνομα Χρήστη</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Εισάγετε το όνομα χρήστη"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Κωδικός Πρόσβασης</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Εισάγετε τον κωδικό"
                  required
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

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { logout } as any);
        }
        return child;
      })}
    </div>
  );
};

export default PasswordProtection;