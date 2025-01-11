import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex space-x-4">
            <Link
              to="/safety-hub"
              className="text-foreground hover:text-foreground/80 transition-colors"
            >
              Safety Hub
            </Link>
            <Link
              to="/worldwide-insights"
              className="text-foreground hover:text-foreground/80 transition-colors"
            >
              Worldwide Insights
            </Link>
          </div>
          <Button onClick={handleSignOut} variant="ghost">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;