import React from "react";
import { Mail } from "lucide-react";

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;
