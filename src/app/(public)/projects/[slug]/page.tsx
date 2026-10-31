import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } }).catch(() => null);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
    openGraph: { images: project.thumbnail ? [project.thumbnail] : [] },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });
  } catch {
    notFound();
  }

  if (!project || !project.published) notFound();

  return (
    <>
      <PageHeader badge="Project" title={project.title} description={project.description} />

      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {project.thumbnail && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-xl border bg-muted">
            <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
        </div>

        <div className="mb-8 flex gap-3">
          {project.githubUrl && (
            <Button variant="outline" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {project.longDescription && (
              <Card>
                <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.longDescription}</p>
                </CardContent>
              </Card>
            )}

            {project.challenges && (
              <Card>
                <CardHeader><CardTitle>Challenges</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.challenges}</p>
                </CardContent>
              </Card>
            )}

            {project.solutions && (
              <Card>
                <CardHeader><CardTitle>Solutions</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.solutions}</p>
                </CardContent>
              </Card>
            )}

            {project.architecture && (
              <Card>
                <CardHeader><CardTitle>Architecture</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.architecture}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {project.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gallery</h3>
              {project.images.map((image) => (
                <div key={image.id} className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image src={image.url} alt={image.alt ?? project.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
