import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon, Shield, Bell, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Community Safety Watch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join your neighbors in making our community safer. Report and track incidents, stay informed, and help create a safer environment for everyone.
          </p>
          <Link to="/safety-hub">
            <Button className="mt-8" size="lg">
              Enter Safety Hub
              <MapIcon className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Real-time Incidents</CardTitle>
              <CardDescription>
                Stay informed about safety incidents in your area as they happen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <Bell className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Instant Alerts</CardTitle>
              <CardDescription>
                Receive notifications about important safety updates in your region
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Connect with neighbors and local authorities to build a safer community
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;