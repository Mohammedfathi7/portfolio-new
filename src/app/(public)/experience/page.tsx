import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";
import { ExperiencePhoto } from "@/components/experience/experience-photo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and work history of Mohamed Fathi.",
};

const PRELOADED_EXPERIENCES = [
  {
    id: "exp-1",
    company: "Self-Employed / Personal Projects",
    position: "Backend Developer",
    location: "Remote",
    startDate: new Date("2025-01-01"),
    endDate: null,
    current: true,
    description: "Building backend applications and RESTful APIs using Node.js and Express.js while following clean architecture principles and best practices. Designing scalable applications, implementing authentication systems, working with databases, and continuously improving software engineering skills through practical projects.\n\nResponsibilities:\n• Develop REST APIs using Node.js and Express.js.\n• Design and implement authentication and authorization systems.\n• Work with SQL and NoSQL databases.\n• Implement Prisma ORM and database modeling.\n• Apply MVC architecture and clean code principles.\n• Build secure backend systems and handle error management.\n• Learn and apply cloud computing concepts and modern backend technologies.",
    technologies: ["Node.js", "Express.js", "JavaScript", "Prisma ORM", "SQL Server", "MongoDB", "REST APIs", "JWT", "Git", "GitHub"],
    order: 1
  },
  {
    id: "exp-2",
    company: "Freelance Projects",
    position: "WordPress Developer",
    location: "Remote",
    startDate: new Date("2025-06-01"),
    endDate: null,
    current: true,
    description: "Designing and developing modern WordPress websites and custom themes with a strong focus on user experience, responsive design, and performance optimization.\n\nResponsibilities:\n• Build and customize WordPress websites.\n• Develop custom themes and layouts.\n• Optimize website performance and responsiveness.\n• Implement SEO best practices.\n• Deliver professional websites for clients.",
    technologies: ["WordPress", "PHP", "HTML", "CSS", "JavaScript", "Elementor"],
    order: 2
  },
  {
    id: "exp-3",
    company: "Personal Projects",
    position: "Machine Learning & Data Projects Developer",
    location: "Remote",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-06-30"),
    current: false,
    description: "Developed a football match prediction system using machine learning techniques and web scraping tools to collect and analyze football data.\n\nResponsibilities:\n• Collect and process data using Selenium and BeautifulSoup.\n• Prepare datasets and train machine learning models.\n• Build prediction systems using Random Forest algorithms.\n• Analyze results and improve model accuracy.",
    technologies: ["Python", "Selenium", "BeautifulSoup", "Machine Learning", "Random Forest", "Data Analysis"],
    order: 3
  },
  {
    id: "exp-4",
    company: "Faculty of Computer Science",
    position: "Computer Science Student",
    location: "Egypt",
    startDate: new Date("2022-09-01"),
    endDate: null,
    current: true,
    description: "Studying computer science fundamentals including algorithms, data structures, databases, software engineering, cloud computing, and system design while building practical projects and continuously improving programming and problem-solving skills.",
    technologies: ["Java", "JavaScript", "SQL", "Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Cloud Computing"],
    order: 4
  }
];

export default async function ExperiencePage() {
  let dbExperiences: any[] = [];
  try {
    dbExperiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
  } catch {
    // Database not connected
  }

  // Merge preloaded data with database projects
  const experiences = [...PRELOADED_EXPERIENCES];
  dbExperiences.forEach((dbExp) => {
    const isDuplicate = experiences.some(
      (e) => e.company.toLowerCase() === dbExp.company.toLowerCase() &&
             e.position.toLowerCase() === dbExp.position.toLowerCase()
    );
    if (!isDuplicate) {
      experiences.push({
        id: dbExp.id,
        company: dbExp.company,
        position: dbExp.position,
        location: dbExp.location,
        startDate: dbExp.startDate,
        endDate: dbExp.endDate,
        current: dbExp.current,
        description: dbExp.description,
        technologies: dbExp.technologies,
        order: dbExp.order
      });
    }
  });

  // Sort experiences: current first, then by start date descending
  experiences.sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <>
      <PageHeader
        badge="Career"
        title="Experience"
        description="My professional journey building full-stack applications with a focus on performance and clean architecture."
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Decorative graphic side column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ExperiencePhoto />
          </div>

          {/* Timeline column */}
          <div className="lg:col-span-8">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2" />

              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`relative flex flex-col md:flex-row ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="absolute left-4 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2" />

                    <div className="w-full pl-10 md:w-1/2 md:pl-0 md:pr-8">
                      {index % 2 !== 0 && <div className="hidden md:block" />}
                      <Card className={`${index % 2 === 0 ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8"}`}>
                        <CardContent className="p-6">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {formatDateShort(exp.startDate)} —{" "}
                              {exp.current ? "Present" : exp.endDate ? formatDateShort(exp.endDate) : "Present"}
                            </span>
                            {exp.current && <Badge variant="secondary">Current</Badge>}
                          </div>
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className="text-sm font-medium text-primary">{exp.company}</p>
                          {exp.location && (
                            <p className="mt-1 text-xs text-muted-foreground">{exp.location}</p>
                          )}
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {exp.description}
                          </p>
                          {exp.technologies.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {exp.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="hidden w-1/2 md:block" />
                  </div>
                ))}
              </div>
            </div>

            {experiences.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                Experience entries will appear here once added via the admin dashboard.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
