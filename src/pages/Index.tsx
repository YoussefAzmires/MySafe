import React from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import ContactList from '@/components/ContactList';
import SafetyTips from '@/components/SafetyTips';
import LocationSharing from '@/components/LocationSharing';
import { Police, Ambulance } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Safety First</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <EmergencyButton
            label="Police"
            number="911"
            icon={<Police className="w-6 h-6" />}
          />
          <EmergencyButton
            label="Ambulance"
            number="911"
            icon={<Ambulance className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <LocationSharing />
            <ContactList />
          </div>
          <div>
            <SafetyTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;