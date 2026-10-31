"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email: "mofathi2648@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohamed-fathi-102311315/",
    github: "https://github.com/Mohammedfathi7",
    location: "Egypt",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings((s) => ({ ...s, ...data })))
      .catch(() => {});
  }, []);

  async function onSubmit(data: ContactFormData) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      toast({ title: "Error", description: err.error ?? "Failed to send message", variant: "destructive" });
      return;
    }

    toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
    reset();
  }

  return (
    <>
      <PageHeader
        badge="Contact"
        title="Get in Touch"
        description="Have a project in mind or want to connect? Send me a message."
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Animated Contact Image with Glassmorphism Border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-lg shadow-2xl p-2.5 group"
            >
              {/* Radial glow background */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50">
                <Image
                  src="/photos/Contact.jpg"
                  alt="Contact Me"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-30" />
              </div>
            </motion.div>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                  {settings.email}
                </a>
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                )}
                
                {settings.github && (
                  <a href={settings.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                )}
                {settings.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    {settings.location}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} placeholder="Your name" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject")} placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" {...register("message")} placeholder="Your message..." rows={5} />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
