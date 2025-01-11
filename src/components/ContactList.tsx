import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone, Heart, User } from 'lucide-react';

interface Contact {
  name: string;
  number: string;
  relation: string;
}

const contacts: Contact[] = [
  { name: "John Doe", number: "555-0123", relation: "Family" },
  { name: "Jane Smith", number: "555-0124", relation: "Friend" },
  { name: "Emergency Services", number: "911", relation: "Emergency" },
];

const ContactList = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
      {contacts.map((contact, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{contact.name}</h3>
              <p className="text-sm text-gray-500">{contact.number}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Heart className="w-4 h-4" />
              <span>{contact.relation}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContactList;