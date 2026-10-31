"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatDateShort } from "@/lib/utils";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [form, setForm] = useState({ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" });
  const { toast } = useToast();

  async function load() {
    const res = await fetch("/api/experience");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/experience/${editing.id}` : "/api/experience";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, technologies }) });
    if (res.ok) {
      toast({ title: editing ? "Updated" : "Created" });
      setEditing(null);
      setForm({ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" });
      setTechnologies([]);
      load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" });
    load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Experience</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Position</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} /></div>
            <div className="flex items-center gap-2 pt-6"><Switch checked={form.current} onCheckedChange={(v) => setForm({ ...form, current: v, endDate: v ? "" : form.endDate })} /><Label>Current</Label></div>
            <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required /></div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (techInput.trim()) { setTechnologies([...technologies, techInput.trim()]); setTechInput(""); } } }} />
                <Button type="button" onClick={() => { if (techInput.trim()) { setTechnologies([...technologies, techInput.trim()]); setTechInput(""); } }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">{technologies.map((t) => <span key={t} className="text-sm bg-secondary px-2 py-1 rounded">{t}</span>)}</div>
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit">{editing ? "Update" : "Add"} Experience</Button>
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
                <h3 className="font-semibold">{item.position}</h3>
                <p className="text-sm text-muted-foreground">{item.company} · {formatDateShort(item.startDate)} — {item.current ? "Present" : item.endDate ? formatDateShort(item.endDate) : ""}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing(item); setForm({ company: item.company, position: item.position, location: "", startDate: item.startDate.split("T")[0], endDate: item.endDate?.split("T")[0] ?? "", current: item.current, description: "" }); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
