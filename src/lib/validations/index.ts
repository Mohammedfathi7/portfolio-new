import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  longDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  technologies: z.array(z.string()).min(1, "Add at least one technology"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  architecture: z.string().optional(),
  published: z.boolean().default(true),
  order: z.coerce.number().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(2, "Title is required"),
  organization: z.string().min(2, "Organization is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  verificationCode: z.string().optional(),
  verificationUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(["BACKEND", "DATABASE", "CLOUD", "TOOLS", "SOFT_SKILLS"]),
  proficiency: z.coerce.number().min(0).max(100).default(80),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(2, "Company is required"),
  position: z.string().min(2, "Position is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, "Description is required"),
  technologies: z.array(z.string()).default([]),
  order: z.coerce.number().default(0),
});

export const seoSchema = z.object({
  siteTitle: z.string().min(2),
  metaDescription: z.string().min(10),
  keywords: z.string().min(2),
  ogImage: z.string().optional(),
});

export const settingsSchema = z.object({
  fullName: z.string().min(2),
  title: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  resumeUrl: z.string().optional(),
  aboutSummary: z.string().optional(),
  education: z.string().optional(),
  careerGoals: z.string().optional(),
  technologiesUsed: z.string().optional(),
  heroIntro: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SeoFormData = z.infer<typeof seoSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
