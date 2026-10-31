"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  Code2, 
  Globe, 
  Cpu, 
  Search, 
  Terminal, 
  Users, 
  BookOpen, 
  Sparkles, 
  Laptop, 
  FileCode,
  Workflow,
  Wrench
} from "lucide-react";

// Categorized Skills Data based on user requirements
const SKILLS_DATA = [
  {
    category: "Backend Development",
    icon: Server,
    color: "from-blue-600 to-cyan-500",
    skills: [
      { name: "Node.js", proficiency: 95 },
      { name: "Express.js", proficiency: 93 },
      { name: "REST APIs", proficiency: 96 },
      { name: "JWT Authentication", proficiency: 94 },
      { name: "Authentication & Authorization", proficiency: 92 },
      { name: "Middleware Development", proficiency: 90 },
      { name: "API Design", proficiency: 95 },
      { name: "MVC Architecture", proficiency: 91 },
      { name: "Error Handling", proficiency: 92 },
      { name: "Password Hashing (bcrypt)", proficiency: 93 },
      { name: "Email Verification", proficiency: 88 },
      { name: "Password Reset Flow", proficiency: 90 },
      { name: "Rate Limiting", proficiency: 87 },
      { name: "API Security", proficiency: 91 },
      { name: "Prisma ORM", proficiency: 90 }
    ]
  },
  {
    category: "Databases",
    icon: Database,
    color: "from-purple-600 to-indigo-500",
    skills: [
      { name: "SQL Server", proficiency: 90 },
      { name: "MySQL", proficiency: 89 },
      { name: "MongoDB", proficiency: 92 },
      { name: "Database Design", proficiency: 91 },
      { name: "Database Normalization", proficiency: 88 },
      { name: "ERD Design", proficiency: 90 },
      { name: "Transactions", proficiency: 87 },
      { name: "Stored Procedures", proficiency: 85 }
    ]
  },
  {
    category: "Programming Languages",
    icon: Code2,
    color: "from-emerald-600 to-teal-500",
    skills: [
      { name: "JavaScript", proficiency: 95 },
      { name: "Java", proficiency: 85 },
      { name: "Python", proficiency: 88 },
      { name: "SQL", proficiency: 91 }
    ]
  },
  {
    category: "Web Technologies",
    icon: Globe,
    color: "from-pink-600 to-rose-500",
    skills: [
      { name: "HTML5", proficiency: 96 },
      { name: "CSS3", proficiency: 92 },
      { name: "Responsive Design", proficiency: 95 },
      { name: "Tailwind CSS", proficiency: 94 }
    ]
  },
  {
    category: "WordPress",
    icon: Laptop,
    color: "from-sky-600 to-blue-400",
    skills: [
      { name: "Custom WordPress Theme Development", proficiency: 90 },
      { name: "WordPress Customization", proficiency: 92 },
      { name: "Elementor", proficiency: 93 },
      { name: "Performance Optimization", proficiency: 88 }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    skills: [
      { name: "AWS (Learning)", proficiency: 65 },
      { name: "Git", proficiency: 94 },
      { name: "GitHub", proficiency: 93 },
      { name: "Environment Configuration", proficiency: 89 },
      { name: "Deployment Basics", proficiency: 85 }
    ]
  },
  {
    category: "Software Engineering",
    icon: Cpu,
    color: "from-indigo-600 to-violet-500",
    skills: [
      { name: "Object-Oriented Programming (OOP)", proficiency: 91 },
      { name: "SOLID Principles", proficiency: 88 },
      { name: "Design Patterns", proficiency: 85 },
      { name: "Clean Code", proficiency: 90 },
      { name: "Clean Architecture", proficiency: 86 },
      { name: "Problem Solving", proficiency: 93 },
      { name: "Debugging", proficiency: 92 },
      { name: "Software Design", proficiency: 89 }
    ]
  },
  {
    category: "Web Scraping & Data",
    icon: FileCode,
    color: "from-teal-600 to-emerald-500",
    skills: [
      { name: "Selenium", proficiency: 88 },
      { name: "BeautifulSoup", proficiency: 85 },
      { name: "Data Collection", proficiency: 90 },
      { name: "Data Processing", proficiency: 86 }
    ]
  },
  {
    category: "Machine Learning",
    icon: Workflow,
    color: "from-violet-600 to-fuchsia-500",
    skills: [
      { name: "Random Forest", proficiency: 80 },
      { name: "Model Training", proficiency: 78 },
      { name: "Data Preparation", proficiency: 82 },
      { name: "Sports Prediction", proficiency: 85 }
    ]
  },
  {
    category: "Development Tools",
    icon: Wrench,
    color: "from-blue-600 to-indigo-500",
    skills: [
      { name: "VS Code", proficiency: 95 },
      { name: "NetBeans", proficiency: 80 },
      { name: "Postman", proficiency: 94 },
      { name: "LocalWP", proficiency: 90 },
      { name: "npm", proficiency: 92 }
    ]
  },
  {
    category: "Version Control",
    icon: Sparkles,
    color: "from-amber-600 to-yellow-500",
    skills: [
      { name: "Git", proficiency: 94 },
      { name: "GitHub", proficiency: 93 },
      { name: "Branch Management", proficiency: 90 },
      { name: "Pull Requests", proficiency: 92 }
    ]
  },
  {
    category: "Currently Learning",
    icon: BookOpen,
    color: "from-fuchsia-600 to-pink-500",
    skills: [
      { name: "AWS Cloud", proficiency: 68 },
      { name: "System Design", proficiency: 75 },
      { name: "Advanced Backend Architecture", proficiency: 78 },
      { name: "Express.js Best Practices", proficiency: 82 },
      { name: "API Security", proficiency: 80 }
    ]
  },
  {
    category: "Soft Skills",
    icon: Users,
    color: "from-green-600 to-emerald-500",
    skills: [
      { name: "Problem Solving", proficiency: 95 },
      { name: "Fast Learner", proficiency: 96 },
      { name: "Attention to Detail", proficiency: 94 },
      { name: "Team Collaboration", proficiency: 92 },
      { name: "Time Management", proficiency: 90 },
      { name: "Communication", proficiency: 91 },
      { name: "Self Learning", proficiency: 96 }
    ]
  }
];

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCategories = SKILLS_DATA.map((cat) => {
    const filteredSkills = cat.skills.filter((skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, skills: filteredSkills };
  }).filter((cat) => {
    const matchesCategory = activeCategory === "All" || cat.category === activeCategory;
    return matchesCategory && cat.skills.length > 0;
  });

  return (
    <>
      <PageHeader
        badge="Expertise"
        title="Skills & Technologies"
        description="A structured overview of my software engineering capabilities, backend architecture expertise, and technical stacks."
      />

      <div className="container mx-auto px-4 py-16">
        {/* Intro Section with Skills Graphic */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Technical Proficiency</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              I specialize in backend development, server-side APIs, database modeling, and scalable logic. Over the years, I&apos;ve designed custom architectures using structured software engineering patterns and clean code principles.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary py-1 px-3">
                API Design & Security
              </Badge>
              <Badge variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-500 py-1 px-3">
                Relational & NoSQL Databases
              </Badge>
              <Badge variant="outline" className="border-pink-500/20 bg-pink-500/5 text-pink-500 py-1 px-3">
                Clean Monoliths & Microservices
              </Badge>
            </div>
          </div>
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="mx-auto text-xs font-mono text-muted-foreground select-none">skills_dashboard.webp</span>
              </div>
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <Image 
                  src="/photos/Skills.webp" 
                  fill 
                  priority
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-105" 
                  alt="Skills Dashboard" 
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search specific skills (e.g. Express, JWT, AWS)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} skills across {filteredCategories.length} categories
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap gap-2 border-b border-border/40 pb-6">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {SKILLS_DATA.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat.category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div 
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <motion.div
                  layout
                  key={cat.category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-foreground/10 hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-3 border-b border-border/20 bg-muted/10 pb-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${cat.color} text-white shadow-md`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-bold">{cat.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                      {cat.skills.map((skill) => (
                        <div key={skill.name} className="group/item">
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-semibold text-foreground/90 transition-colors group-hover/item:text-primary">
                              {skill.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {skill.proficiency}%
                            </span>
                          </div>
                          
                          {/* Animated Progress Bar */}
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-muted-foreground"
          >
            <p className="text-lg">No skills found matching &quot;{search}&quot;</p>
            <p className="text-sm mt-2">Try checking for spelling or adjusting filters.</p>
          </motion.div>
        )}
      </div>
    </>
  );
}
