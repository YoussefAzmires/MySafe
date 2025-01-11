import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon, Shield, Bell, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-16 space-y-32">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 animate-scale-in">
            Community Safety Watch
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in opacity-0" style={{ animationDelay: '300ms' }}>
            Join your neighbors in making our community safer. Report and track incidents, stay informed, and help create a safer environment for everyone.
          </p>
          <Link to="/safety-hub">
            <Button 
              className="mt-8 animate-scale-in opacity-0 hover:scale-105 transition-transform" 
              size="lg"
              style={{ animationDelay: '600ms' }}
            >
              Enter Safety Hub
              <MapIcon className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card/50 backdrop-blur transform hover:scale-105 transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: '900ms' }}>
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Real-time Incidents</CardTitle>
              <CardDescription>
                Stay informed about safety incidents in your area as they happen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur transform hover:scale-105 transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: '1200ms' }}>
            <CardHeader>
              <Bell className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Instant Alerts</CardTitle>
              <CardDescription>
                Receive notifications about important safety updates in your region
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur transform hover:scale-105 transition-all duration-300 animate-fade-in opacity-0" style={{ animationDelay: '1500ms' }}>
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Connect with neighbors and local authorities to build a safer community
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center animate-fade-in opacity-0" style={{ animationDelay: '1800ms' }}>
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
            <p className="text-muted-foreground">Monitoring</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-muted-foreground">Communities</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
            <p className="text-muted-foreground">Response Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;