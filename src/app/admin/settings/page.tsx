"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { settingsSchema, type SettingsFormData } from "@/lib/validations";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => reset(data));
  }, [reset]);

  async function onSubmit(data: SettingsFormData) {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (res.ok) toast({ title: "Settings saved" });
    else toast({ title: "Error", variant: "destructive" });
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Full Name</Label><Input {...register("fullName")} /></div>
              <div className="space-y-2"><Label>Title</Label><Input {...register("title")} /></div>
              <div className="space-y-2"><Label>Email</Label><Input {...register("email")} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input {...register("phone")} /></div>
              <div className="space-y-2"><Label>Location</Label><Input {...register("location")} /></div>
              <div className="space-y-2"><Label>Resume URL</Label><Input {...register("resumeUrl")} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>LinkedIn</Label><Input {...register("linkedin")} /></div>
            <div className="space-y-2"><Label>GitHub</Label><Input {...register("github")} /></div>
            <div className="space-y-2"><Label>Twitter</Label><Input {...register("twitter")} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Hero Introduction</Label><Textarea {...register("heroIntro")} rows={2} /></div>
            <div className="space-y-2"><Label>About Summary</Label><Textarea {...register("aboutSummary")} rows={3} /></div>
            <div className="space-y-2"><Label>Education</Label><Textarea {...register("education")} rows={2} /></div>
            <div className="space-y-2"><Label>Career Goals</Label><Textarea {...register("careerGoals")} rows={2} /></div>
            <div className="space-y-2"><Label>Technologies Used (comma-separated)</Label><Input {...register("technologiesUsed")} /></div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>Save Settings</Button>
      </form>
    </div>
  );
}
