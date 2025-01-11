import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LocationSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleLocationToggle = () => {
    console.log('Location sharing toggled:', !isSharing);
    setIsSharing(!isSharing);
    toast({
      title: !isSharing ? "Location Sharing Enabled" : "Location Sharing Disabled",
      description: !isSharing 
        ? "Your trusted contacts can now see your location" 
        : "Your location is now private",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Location Sharing</h3>
            <p className="text-sm text-gray-500">
              {isSharing ? "Your location is being shared" : "Location sharing is disabled"}
            </p>
          </div>
        </div>
        <Switch
          checked={isSharing}
          onCheckedChange={handleLocationToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </Card>
  );
};

export default LocationSharing;