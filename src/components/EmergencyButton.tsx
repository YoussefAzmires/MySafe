import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface EmergencyButtonProps {
  label: string;
  number: string;
  icon?: React.ReactNode;
}

const EmergencyButton = ({ label, number, icon }: EmergencyButtonProps) => {
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    console.log(`Emergency call triggered for ${label}: ${number}`);
    window.location.href = `tel:${number}`;
    toast({
      title: "Emergency Call Initiated",
      description: `Calling ${label}: ${number}`,
    });
  };

  return (
    <Button
      className="w-full h-16 mb-4 bg-primary hover:bg-primary/90 transition-all"
      onClick={handleEmergencyCall}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon || <Phone className="w-6 h-6" />}
        <span className="text-lg font-semibold">{label}</span>
      </div>
    </Button>
  );
};

export default EmergencyButton;