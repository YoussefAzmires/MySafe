import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface IncidentFormProps {
  location: { lat: number; lng: number };
  onSubmit: (data: any) => void;
}

const IncidentForm = ({ location, onSubmit }: IncidentFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !type) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      type,
      location,
      timestamp: new Date().toISOString(),
    });

    // Reset form
    setTitle("");
    setDescription("");
    setType("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Incident Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Incident Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="accident">Traffic Accident</SelectItem>
            <SelectItem value="infrastructure">Infrastructure Issue</SelectItem>
            <SelectItem value="noise">Noise Complaint</SelectItem>
            <SelectItem value="safety">Safety Concern</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Textarea
          placeholder="Describe the incident..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="text-sm text-gray-500">
        Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
      </div>

      <Button type="submit" className="w-full">
        Report Incident
      </Button>
    </form>
  );
};

export default IncidentForm;