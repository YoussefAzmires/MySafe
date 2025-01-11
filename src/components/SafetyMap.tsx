import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import IncidentForm from "./IncidentForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Location = {
  lat: number;
  lng: number;
};

type Message = Database["public"]["Tables"]["messages"]["Row"];

type Incident = {
  id: string;
  title: string;
  description: string;
  type: string;
  location: Location;
  timestamp: string | null;
  user_id: string;
  messages?: Message[];
};

const SafetyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    bounds: {
      _sw: { lat: number; lng: number };
      _ne: { lat: number; lng: number };
    };
    mapImage: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setCurrentUser(session.user.email);
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: incidents = [], isError } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select(
          `
          *,
          messages(*)
        `
        )
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching incidents:", error);
        throw error;
      }

      // Transform the data to match our Incident type
      return (data as any[]).map((incident) => ({
        ...incident,
        location: incident.location as Location,
      })) as Incident[];
    },
  });

  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    setFilteredIncidents(incidents);
  }, [incidents]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Success",
            description: "Located your position successfully",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Could not get your location. Defaulting to NYC.",
            variant: "destructive",
          });
          setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to NYC
        }
      );
    } else {
      toast({
        title: "Error",
        description:
          "Geolocation is not supported by your browser. Defaulting to NYC.",
        variant: "destructive",
      });
      setUserLocation({ lat: 40.7128, lng: -74.006 }); // Default to NYC
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "safety":
        return "bg-destructive";
      case "accident":
        return "bg-incident-accident";
      case "infrastructure":
        return "bg-incident-infrastructure";
      case "noise":
        return "bg-incident-noise";
      default:
        return "bg-incident-other";
    }
  };

  const updateMarkers = () => {
    if (!map.current) return;

    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    filteredIncidents.forEach((incident) => {
      if (!incident.location) return;

      const isRecent =
        incident.timestamp &&
        new Date().getTime() - new Date(incident.timestamp).getTime() <
          3 * 60 * 60 * 1000; // 3 hours in milliseconds

      const el = document.createElement("div");
      el.className = `w-6 h-6 ${getIncidentColor(
        incident.type
      )} rounded-full border-2 border-white cursor-pointer ${
        isRecent ? "animate-blink" : ""
      }`;

      const formattedDate = incident.timestamp
        ? format(new Date(incident.timestamp), "PPpp")
        : "Date not available";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.location.lng, incident.location.lat])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
            className: "custom-popup",
          }).setHTML(`
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg mb-2">${incident.title}</h3>
                <p class="text-sm mb-2">${incident.description}</p>
                <div class="text-xs space-y-1">
                  <p><span class="font-semibold">Type:</span> ${
                    incident.type
                  }</p>
                  <p><span class="font-semibold">Reported:</span> ${formattedDate}</p>
                  ${
                    isRecent
                      ? '<p class="text-destructive font-semibold mt-2">Recent incident!</p>'
                      : ""
                  }
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      // Show popup on hover
      el.addEventListener("mouseenter", () => {
        marker.getPopup().addTo(map.current!);
      });

      el.addEventListener("mouseleave", () => {
        marker.getPopup().remove();
      });

      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent map click event
        setSelectedIncident(incident);
      });

      markers.current[incident.id] = marker;
    });

    if (userLocation) {
      const userMarkerElement = document.createElement("div");
      userMarkerElement.className =
        "w-6 h-6 bg-primary rounded-full border-2 border-white";

      new mapboxgl.Marker(userMarkerElement)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }
  };

  const handleAddIncident = () => {
    if (!userLocation) {
      toast({
        title: "Error",
        description: "Could not get your location. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setSelectedLocation(userLocation);
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

    const coordinates = e.lngLat;
    setSelectedLocation({
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
  };

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.type === "add-incident") {
        handleAddIncident();
      }
    };

    window.addEventListener("add-incident", handleCustomEvent as EventListener);
    return () => {
      window.removeEventListener(
        "add-incident",
        handleCustomEvent as EventListener
      );
    };
  }, [userLocation]);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken =
        "pk.eyJ1IjoidGhlc2VmZmYiLCJhIjoiY201cjJuZ3FrMDZpdjJscTJvNTJ0cjRmNiJ9.tJGSW1g1fT75_02kUxPHMQ";

      if (map.current) {
        map.current.remove();
      }

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [userLocation?.lng || -74.006, userLocation?.lat || 40.7128],
        zoom: 12,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), "top-right");

      newMap.on("click", handleMapClick);

      // Update region and store data when map moves
      newMap.on("moveend", async () => {
        const bounds = newMap.getBounds();

        const regionDetails = {
          name: "Current View",
          bounds: {
            _sw: { lat: bounds.getSouth(), lng: bounds.getWest() },
            _ne: { lat: bounds.getNorth(), lng: bounds.getEast() },
          },
          mapImage: `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}/500x500?access_token=YOUR_MAPBOX_ACCESS_TOKEN`,
        };

        console.log("Updating Selected Region:", regionDetails);

        setSelectedRegion(regionDetails);

        try {
          // Fetch incidents within viewport
          const { data, error } = await supabase
            .from("incidents")
            .select(
              `
              *,
              messages(*)
            `
            )
            .gte("location->lng", bounds.getWest())
            .lte("location->lng", bounds.getEast())
            .gte("location->lat", bounds.getSouth())
            .lte("location->lat", bounds.getNorth())
            .order("timestamp", { ascending: false });

          if (error) {
            console.error("Error fetching incidents:", error);
            return;
          }

          if (data) {
            // Transform the data to match our Incident type
            const transformedData = data.map((incident) => ({
              ...incident,
              location: incident.location as Location,
            })) as Incident[];

            setFilteredIncidents(transformedData);

            // Store the current incidents in Supabase for Regional Insights
            const { error: storeError } = await supabase
              .from("current_region")
              .upsert({
                id: 1, // Single row
                name: "Current View",
                incident_ids: transformedData.map((incident) => incident.id),
              });

            if (storeError) {
              console.error("Error storing current incidents:", storeError);
            }
          }
        } catch (error) {
          console.error("Error updating incidents:", error);
        }
      });

      map.current = newMap;

      toast({
        title: "Success",
        description: "Map initialized successfully",
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeMap();
  }, [userLocation]);

  useEffect(() => {
    updateMarkers();
  }, [filteredIncidents]);

  const handleIncidentSubmit = async (data: {
    title: string;
    description: string;
    type: string;
    location: Location;
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to report incidents",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("incidents").insert([
        {
          ...data,
          user_id: user.id,
          location: { lat: data.location.lat, lng: data.location.lng },
        },
      ]);

      if (error) throw error;

      setSelectedLocation(null);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });

      toast({
        title: "Success",
        description: "Incident reported successfully",
      });
    } catch (error) {
      console.error("Error submitting incident:", error);
      toast({
        title: "Error",
        description: "Failed to submit incident",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedIncident || !newMessage.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("messages").insert([
        {
          incident_id: selectedIncident.id,
          text: newMessage,
          author: user.email || "Anonymous User",
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setNewMessage("");

      const updatedIncident = {
        ...selectedIncident,
        messages: [
          ...(selectedIncident.messages || []),
          {
            id: crypto.randomUUID(),
            incident_id: selectedIncident.id,
            text: newMessage,
            author: user.email || "Anonymous User",
            user_id: user.id,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setSelectedIncident(updatedIncident);

      queryClient.invalidateQueries({ queryKey: ["incidents"] });

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

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

  useEffect(() => {
    const handleFilterIncidents = (event: CustomEvent) => {
      const selectedType = event.detail.type;
      if (!selectedType) {
        setFilteredIncidents(incidents);
      } else {
        setFilteredIncidents(
          incidents.filter((incident) => incident.type === selectedType)
        );
      }
    };

    window.addEventListener(
      "filter-incidents",
      handleFilterIncidents as EventListener
    );

    return () => {
      window.removeEventListener(
        "filter-incidents",
        handleFilterIncidents as EventListener
      );
    };
  }, [incidents]);

  return (
    <div className="h-screen w-screen relative pt-14">
      {selectedRegion && (
        <div className="absolute top-20 left-4 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
          <h2 className="text-lg font-semibold text-primary">Current Region</h2>
          <p className="text-muted-foreground">{selectedRegion.name}</p>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 mt-14" />

      <div className="absolute top-20 right-4 z-10 space-x-2 flex">
        <Button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("filter-incidents"))
          }
          variant="secondary"
        >
          Filter Incidents
        </Button>
        <Button onClick={handleAddIncident} variant="default">
          + Report Incident
        </Button>
      </div>

      <Dialog
        open={!!selectedLocation}
        onOpenChange={() => setSelectedLocation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Incident</DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <IncidentForm
              location={selectedLocation}
              onSubmit={handleIncidentSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedIncident}
        onOpenChange={() => setSelectedIncident(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedIncident?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {selectedIncident?.description}
            </div>
            <div className="border rounded-lg">
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-4">
                  {selectedIncident?.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.author === currentUser
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">
                          {message.author}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp || "").toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafetyMap;
