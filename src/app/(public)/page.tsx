import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/home/hero-section";
import { ProjectCard } from "@/components/projects/project-card";
import { getSiteSettings } from "@/lib/settings";
import { prisma, withPrismaTimeout } from "@/lib/prisma";
import { getCatalogProjects } from "@/lib/project-catalog";

export default async function HomePage() {
  const settings = await getSiteSettings();

  const catalogFeatured = getCatalogProjects()
    .filter((project) => project.featured)
    .slice(0, 4);

  let dbFeatured: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    dbFeatured = await withPrismaTimeout(() =>
      prisma.project.findMany({
        where: { published: true, featured: true },
        take: 4,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      })
    );
  } catch {
    // Database not connected yet
  }

  const featuredProjects = catalogFeatured.length > 0 ? catalogFeatured : dbFeatured;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.fullName,
    jobTitle: settings.title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [settings.github, settings.linkedin].filter(Boolean),
    email: settings.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        fullName={settings.fullName}
        heroIntro={settings.heroIntro}
        resumeUrl={settings.resumeUrl}
        github={settings.github}
        linkedin={settings.linkedin}
        email={settings.email}
      />

      {featuredProjects.length > 0 && (
        <section id="featured" className="border-t border-border/40 bg-muted/20 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                <p className="mt-2 text-muted-foreground">Highlighted work and recent builds</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/projects">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id={featuredProjects.length > 0 ? undefined : "featured"} className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Let&apos;s build something great</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Looking for a backend developer to help with your next project? I&apos;d love to hear from you.
          </p>
          <Button className="mt-8" size="lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
