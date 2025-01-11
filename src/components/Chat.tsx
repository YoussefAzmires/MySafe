import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const Chat = ({ incidents }: { incidents: Incident[] }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    // Prepare the initial system message with incidents string
    const incidentSummary = incidents
      .map(
        (incident, index) =>
          `${index + 1}. Title: ${incident.title}, Type: ${incident.type}, Description: ${incident.description}, Location: (${incident.location.lat}, ${incident.location.lng}), Timestamp: ${incident.timestamp}`
      )
      .join('\n');

    const initialPrompt = `
You are an assistant with access to recent incidents. Here is the data:
${incidentSummary}

The user can now ask questions. Respond appropriately based on this context.
`;

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/distilgpt2", {
        method: "POST",
        headers: {
          "Authorization": `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`, // Replace with your Hugging Face API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${initialPrompt} \nUser: ${userInput}`,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.generated_text },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Chat with Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto bg-muted p-4 rounded">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.content}
                </span>
              </p>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-2 border rounded"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading}
              className="ml-2"
            >
              {loading ? "Loading..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
