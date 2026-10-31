"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    technologies: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    featured: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const targetUrl = project.liveUrl ?? project.githubUrl ?? "#";
  const hasExternalTarget = Boolean(project.liveUrl || project.githubUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card className="group flex h-full flex-col overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_hsl(var(--foreground)/0.35)]">
        <div>
          <a
            href={targetUrl}
            target={hasExternalTarget ? "_blank" : undefined}
            rel={hasExternalTarget ? "noopener noreferrer" : undefined}
            className="relative block aspect-[16/10] overflow-hidden border-b border-border/40 bg-muted"
            aria-label={`Open ${project.title}`}
          >
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={`${project.title} preview`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted text-muted-foreground">
                <span className="text-4xl font-bold opacity-20">{project.title[0]}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md">
                Visit website
                <ExternalLink className="h-3 w-3 text-primary" />
              </span>
            </div>

            {project.featured && (
              <Badge className="absolute left-3 top-3 border-none bg-background/90 text-[10px] font-semibold text-foreground shadow-sm">
                Featured
              </Badge>
            )}
          </a>

          <CardHeader className="space-y-2 pb-2">
            <a
              href={targetUrl}
              target={hasExternalTarget ? "_blank" : undefined}
              rel={hasExternalTarget ? "noopener noreferrer" : undefined}
              className="inline-block transition-colors group-hover:text-primary"
            >
              <h3 className="line-clamp-1 text-lg font-bold tracking-tight">{project.title}</h3>
            </a>
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </CardHeader>
        </div>

        <div className="mt-auto">
          <CardContent className="pb-3 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="px-1.5 py-0.5 text-[10px]">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="gap-2 border-t border-border/10 bg-muted/10 pt-2">
            {project.liveUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 flex-1 gap-1.5 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 flex-1 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
