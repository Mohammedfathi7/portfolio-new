"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Github, ExternalLink, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string | null;
  thumbnail: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "9",
      ...(search && { search }),
      ...(tech && tech !== "all" && { tech }),
    });

    try {
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects ?? []);
      setFeaturedProject(data.featuredProject ?? null);
      setTechnologies(data.technologies ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, tech]);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProjects, search]);

  return (
    <>
      <PageHeader
        badge="Portfolio"
        title="Projects & Builds"
        description="A list of my web applications, backend systems, APIs, and client platforms."
      />

      <div className="container mx-auto px-4 py-12">
        {/* ========================================
            FEATURED PROJECT (HERO SECTION)
            ======================================== */}
        {featuredProject && !search && !tech && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-20 overflow-hidden rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-md shadow-2xl relative"
          >
            {/* Ambient background glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-purple-500/10 to-transparent blur-3xl opacity-60 pointer-events-none" />

            <div className="grid items-center gap-8 lg:grid-cols-12 p-6 sm:p-10 lg:p-12 relative z-10">
              
              {/* Details Column */}
              <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-amber-500 via-purple-600 to-primary text-white border-none py-1 px-3 shadow-md gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Featured Project
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Dynamic Preview</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className="text-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500">{featuredProject.title}</span>
                </h2>

                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                  {featuredProject.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.technologies.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs py-0.5 px-2.5">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  {featuredProject.liveUrl && (
                    <Button size="lg" className="shadow-lg shadow-primary/25 gap-2" asChild>
                      <a href={featuredProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {featuredProject.githubUrl && (
                    <Button size="lg" variant={featuredProject.liveUrl ? "outline" : "default"} className="gap-2" asChild>
                      <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                        Code Repository
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Player Column */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-border bg-black shadow-2xl group [transform-style:preserve-3d]"
                >
                  {/* Browser top-bar interface */}
                  <div className="flex items-center gap-1.5 border-b border-white/10 bg-zinc-950 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="mx-auto text-[10px] font-mono text-zinc-500 select-none">skill_z_demo.mp4</span>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden">
                    {featuredProject.videoUrl ? (
                      <video
                        src={featuredProject.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-zinc-900">
                        No video preview available
                      </div>
                    )}
                    
                    {/* Shadow overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-60" />
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================
            FILTER & SEARCH SECTION
            ======================================== */}
        <div className="mb-10 space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Project Catalog</h3>
              <p className="text-sm text-muted-foreground mt-1">Explore my live websites and backend systems</p>
            </div>
            {!loading && (
              <span className="text-xs text-muted-foreground font-mono">
                {projects.length} results
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects by keyword..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={tech || "all"} onValueChange={(v) => { setTech(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[240px] bg-card/50">
                <SelectValue placeholder="Filter by Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {technologies.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ========================================
            PROJECTS GRID
            ======================================== */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No projects found.</p>
            <p className="text-sm mt-1">Try resetting the filters or adjusting your search keyword.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================
            PAGINATION
            ======================================== */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4"
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-muted-foreground font-mono">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
