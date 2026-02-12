import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme-provider';

const LandingHeader = () => {
  const { theme, setTheme } = useTheme();

  return <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-foreground">InfluexKonnect</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/landing" className="text-foreground/60 hover:text-foreground transition-colors">Home</Link>
          <Link to="/features" className="text-foreground/60 hover:text-foreground transition-colors">Features</Link>
          <Link to="/pricing" className="text-foreground/60 hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/about" className="text-foreground/60 hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="text-foreground/60 hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
          <Link to="/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </Button>
      </div>
    </header>;
};

export default LandingHeader;