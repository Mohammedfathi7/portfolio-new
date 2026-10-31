import { prisma, withPrismaTimeout } from "@/lib/prisma";

const CURRENT_GITHUB = "https://github.com/Mohammedfathi7";

function normalizeGithubProfile(url?: string) {
  if (!url) return CURRENT_GITHUB;
  const trimmed = url.replace(/\/+$/, "");
  if (/^https?:\/\/(www\.)?github\.com\/es1amnagm$/i.test(trimmed)) {
    return CURRENT_GITHUB;
  }
  return url;
}

const DEFAULT_SETTINGS: Record<string, string> = {
  siteTitle: "Mohamed Fathi | Full Stack Developer",
  metaDescription:
    "Portfolio of Mohamed Fathi, a Full Stack Developer specializing in Node.js, React, APIs, databases, and cloud infrastructure.",
  keywords:
    "Mohamed Fathi, Full Stack Developer, Node.js, React, PostgreSQL, API Development, Software Engineer",
  ogImage: "/og-image.png",
  email: "mofathi2648@gmail.com",
  linkedin: "https://linkedin.com/in/mohamed-fathi-102311315/",
  github: CURRENT_GITHUB,
  facebook: "",
  resumeUrl: "/resumes.pdf",
  fullName: "Mohamed Fathi",
  title: "Full Stack Developer",
  location: "Egypt",
  phone: "",
  aboutSummary:
    "Passionate Full Stack Developer with expertise in building scalable applications, microservices, and robust database architectures. I focus on clean code, performance optimization, and delivering reliable solutions.",
  education:
    "Bachelor's Degree in Computer Science — focused on software engineering, algorithms, and distributed systems.",
  careerGoals:
    "To architect and build high-performance full-stack applications that solve real-world problems, while continuously learning and contributing to the developer community.",
  technologiesUsed:
    "Node.js, TypeScript, Python, PostgreSQL, MongoDB, Redis, Docker, AWS, Git, REST APIs, GraphQL",
  heroIntro:
    "I build scalable backend systems and APIs that power modern applications. Passionate about clean architecture, performance, and developer experience.",
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await withPrismaTimeout(() => prisma.siteSetting.findMany());
    const map: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const setting of settings) {
      map[setting.key] = setting.value;
    }
    map.github = normalizeGithubProfile(map.github);
    return map;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getSiteSetting(key: string): Promise<string> {
  const settings = await getSiteSettings();
  return settings[key] ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function upsertSiteSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function upsertSiteSettings(settings: Record<string, string>) {
  const operations = Object.entries(settings).map(([key, value]) =>
    upsertSiteSetting(key, value)
  );
  return Promise.all(operations);
}
