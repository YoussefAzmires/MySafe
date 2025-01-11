import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Shield, Heart } from 'lucide-react';

const tips = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Stay Aware",
    description: "Always be aware of your surroundings and trust your instincts.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Share Location",
    description: "Let trusted contacts know your location when traveling alone.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Emergency Plan",
    description: "Have an emergency plan and share it with trusted contacts.",
  },
];

const SafetyTips = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Safety Tips</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tips.map((tip, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {React.cloneElement(tip.icon as React.ReactElement, {
                  className: "w-6 h-6 text-primary",
                })}
              </div>
              <h3 className="font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500">{tip.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SafetyTips;