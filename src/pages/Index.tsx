import React, { useState } from 'react';
import SafetyMap from '@/components/SafetyMap';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleAddIncident = () => {
    const event = new CustomEvent('add-incident', {
      detail: { lat: 40.7128, lng: -74.006 }
    });
    window.dispatchEvent(event);
  };

  const handleFilterChange = (type: string | null) => {
    setSelectedType(type);
    const event = new CustomEvent('filter-incidents', {
      detail: { type }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-10 bg-primary p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">Community Safety Watch</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  Filter Incidents
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                  Show All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("accident")}>
                  Traffic Accidents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("infrastructure")}>
                  Infrastructure Issues
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("noise")}>
                  Noise Complaints
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("safety")}>
                  Safety Concerns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("other")}>
                  Other
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={handleAddIncident}
              className="gap-2"
              variant="secondary"
            >
              <Plus className="h-4 w-4" />
              Report Incident
            </Button>
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        <SafetyMap />
      </main>
    </div>
  );
};

export default Index;