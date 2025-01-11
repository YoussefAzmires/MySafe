import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, Map, Home, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate('/auth');
    }
  };

  if (location.pathname === '/auth') return null;

  return (
    <nav className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Link to="/" className="text-xl font-bold">Community Safety Watch</Link>
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link to="/safety-hub">
          <Button variant="ghost" className="gap-2">
            <Map className="h-4 w-4" />
            Safety Hub
          </Button>
        </Link>
        <Link to="/regional-insights">
          <Button variant="ghost" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Regional Insights
          </Button>
        </Link>
        <Button 
          onClick={handleSignOut} 
          variant="secondary" 
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;