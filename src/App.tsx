import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import './App.css';
import PasswordProtection from './components/PasswordProtection';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function App() {
  return (
    <PasswordProtection>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </PasswordProtection>
  );
}

export default App; 