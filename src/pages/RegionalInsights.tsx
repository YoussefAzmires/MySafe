import React from "react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Location = {
  lat: number;
  lng: number;
};

type Incident = {
  id: string;
  title: string;
  description: string;
  type: string;
  location: Location;
  timestamp: string | null;
  user_id: string;
  messages?: Database["public"]["Tables"]["messages"]["Row"][];
};

const RegionalInsights = () => {
  const navigate = useNavigate();

  const { data: currentRegion } = useQuery({
    queryKey: ["currentRegion"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("current_region")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching current region:", error);
        throw error;
      }

      console.log("Fetched currentRegion:", data);
      return data;
    },
  });

  const { data: incidents } = useQuery<Incident[]>({
    queryKey: ["regionalIncidents", currentRegion?.incident_ids],
    queryFn: async () => {
      if (!currentRegion?.incident_ids?.length) {
        console.warn("No incident IDs found for current region.");
        return [];
      }

      const { data, error } = await supabase
        .from("incidents")
        .select(
          `
          *,
          messages(*)
        `
        )
        .in("id", currentRegion.incident_ids);

      if (error) {
        console.error("Error fetching incidents:", error);
        throw error;
      }

      console.log("Fetched incidents:", data);
      return (data as any[]).map((incident) => ({
        ...incident,
        location: incident.location as Location,
      })) as Incident[];
    },
    enabled: !!currentRegion?.incident_ids?.length,
  });

  console.log("Current region:", currentRegion);
  console.log("Incidents:", incidents);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-20 px-4">
        <Button
          onClick={() => navigate("/safety-hub")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Safety Hub
        </Button>

        <h1 className="text-3xl font-bold mb-6">Regional Insights</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Visible Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{incidents?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Incidents</h2>
          {incidents?.map((incident) => (
            <Card key={incident.id}>
              <CardHeader>
                <CardTitle>{incident.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{incident.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Type: {incident.type} | Reported:{" "}
                  {new Date(incident.timestamp || "").toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalInsights;
