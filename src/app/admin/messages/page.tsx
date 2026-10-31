"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  async function load() {
    const res = await fetch("/api/contact");
    if (res.ok) setMessages(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" });
    load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-muted-foreground mb-8">Contact form submissions</p>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={!msg.read ? "border-primary/50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-sm text-muted-foreground">{msg.email}</span>
                    {!msg.read && <Badge>New</Badge>}
                  </div>
                  {msg.subject && <p className="text-sm font-medium mb-2">{msg.subject}</p>}
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-3">{formatDate(msg.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {!msg.read && (
                    <Button variant="outline" size="icon" onClick={() => markRead(msg.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={() => handleDelete(msg.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
