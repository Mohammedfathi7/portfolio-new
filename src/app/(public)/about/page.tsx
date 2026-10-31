import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings } from "@/lib/settings";
import { AboutPhoto } from "@/components/about/about-photo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Mohamed Fathi, Full Stack Developer.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const technologies = settings.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <PageHeader
        badge="About Me"
        title="Building reliable full-stack applications with a focus on performance and clean architecture."
        description="Passionate about clean architecture, performance, and developer experience."
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <AboutPhoto />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Personal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{settings.aboutSummary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Career Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{settings.careerGoals}</p>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{settings.education}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
