import React from "react";
import { Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  logout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ logout }) => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Αποστολή Email</h1>
            <p className="text-sm text-muted-foreground">AKROGONOS INTERNATIONAL GROUP</p>
          </div>
        </div>
        
        {logout && (
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" />
            Έξοδος
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
