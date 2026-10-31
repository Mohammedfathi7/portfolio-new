"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  verificationCode: string | null;
}

export default function AdminCertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ title: "", organization: "", issueDate: "", verificationCode: "", verificationUrl: "", description: "" });
  const { toast } = useToast();

  async function load() {
    const res = await fetch("/api/certificates");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/certificates/${editing.id}` : "/api/certificates";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      toast({ title: editing ? "Updated" : "Created" });
      setEditing(null);
      setForm({ title: "", organization: "", issueDate: "", verificationCode: "", verificationUrl: "", description: "" });
      load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" });
    load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Certificates</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Organization</Label><Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Verification Code</Label><Input value={form.verificationCode} onChange={(e) => setForm({ ...form, verificationCode: e.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit">{editing ? "Update" : "Add"} Certificate</Button>
              {editing && <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.organization} · {formatDate(item.issueDate)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing(item); setForm({ title: item.title, organization: item.organization, issueDate: item.issueDate.split("T")[0], verificationCode: item.verificationCode ?? "", verificationUrl: "", description: "" }); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
