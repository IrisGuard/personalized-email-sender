import React from "react";
import Header from "@/components/Header";
import UnifiedEmailSender from "@/components/UnifiedEmailSender";

interface IndexProps {
  logout?: () => void;
}

const Index: React.FC<IndexProps> = ({ logout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header logout={logout} />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <UnifiedEmailSender />
      </main>
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          AKROGONOS INTERNATIONAL GROUP - Email Sender &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
