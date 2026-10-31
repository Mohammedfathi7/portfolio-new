"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { projectSchema, type ProjectFormData } from "@/lib/validations";

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { featured: false, published: true, order: 0 },
  });

  const featured = watch("featured");
  const published = watch("published");

  function addTech() {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      const updated = [...technologies, techInput.trim()];
      setTechnologies(updated);
      setValue("technologies", updated);
      setTechInput("");
    }
  }

  async function onSubmit(data: ProjectFormData) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, technologies }),
    });
    if (!res.ok) {
      const err = await res.json();
      toast({ title: "Error", description: err.error, variant: "destructive" });
      return;
    }
    toast({ title: "Project created" });
    router.push("/admin/projects");
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setValue("thumbnail", data.url);
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug (optional)</Label>
              <Input {...register("slug")} placeholder="auto-generated from title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={3} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Long Description</Label>
              <Textarea {...register("longDescription")} rows={5} />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <Input type="file" accept="image/*" onChange={handleThumbnailUpload} />
              <Input {...register("thumbnail")} placeholder="Or paste URL" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Technologies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} />
              <Button type="button" onClick={addTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((t) => (
                <span key={t} className="rounded-full bg-secondary px-3 py-1 text-sm">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Links & Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>GitHub URL</Label><Input {...register("githubUrl")} /></div>
            <div className="space-y-2"><Label>Live Demo URL</Label><Input {...register("liveUrl")} /></div>
            <div className="space-y-2"><Label>Challenges</Label><Textarea {...register("challenges")} rows={3} /></div>
            <div className="space-y-2"><Label>Solutions</Label><Textarea {...register("solutions")} rows={3} /></div>
            <div className="space-y-2"><Label>Architecture</Label><Textarea {...register("architecture")} rows={3} /></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={published} onCheckedChange={(v) => setValue("published", v)} />
                <Label>Published</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create Project"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
