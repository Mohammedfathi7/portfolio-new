"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seoSchema, type SeoFormData } from "@/lib/validations";

export default function AdminSeoPage() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      reset({
        siteTitle: data.siteTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        ogImage: data.ogImage,
      });
    });
  }, [reset]);

  async function onSubmit(data: SeoFormData) {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "seo", data }),
    });
    if (res.ok) toast({ title: "SEO settings saved" });
    else toast({ title: "Error", variant: "destructive" });
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">SEO Management</h1>
      <Card>
        <CardHeader><CardTitle>Search Engine Optimization</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Site Title</Label><Input {...register("siteTitle")} /></div>
            <div className="space-y-2"><Label>Meta Description</Label><Textarea {...register("metaDescription")} rows={3} /></div>
            <div className="space-y-2"><Label>Keywords (comma-separated)</Label><Input {...register("keywords")} /></div>
            <div className="space-y-2"><Label>Open Graph Image URL</Label><Input {...register("ogImage")} placeholder="/og-image.png" /></div>
            <Button type="submit" disabled={isSubmitting}>Save SEO Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
