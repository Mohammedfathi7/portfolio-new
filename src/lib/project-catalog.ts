import fs from "fs";
import path from "path";

export interface CatalogProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  videoUrl: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
}

type ProjectMeta = {
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string | null;
  featured?: boolean;
  order?: number;
};

const SKIP_IMAGE_FILES = new Set([
  "conf1-logo.png",
  "my-portfolio-profile.jpg",
]);

const PROJECTS_METADATA: Record<string, ProjectMeta> = {
  "conf1.co.png": {
    title: "Conf1",
    description:
      "Official Arabic website for the 2027 Counseling and Guidance Conference, covering early psychological prevention with program details, speakers, partners, and direct WhatsApp contact.",
    technologies: ["WordPress", "PHP", "CSS3"],
    liveUrl: "https://conf1.co/",
    githubUrl: null,
    featured: true,
    order: 1,
  },
  "rosos.org.png": {
    title: "Rosos",
    description:
      "Bilingual corporate site for Rawabi Souss Trading Co., presenting procurement and fit-out services for major projects, supply sectors, quote requests, and WhatsApp-based sales contact.",
    technologies: ["Vite", "JavaScript"],
    liveUrl: "https://www.rosos.org/",
    githubUrl: null,
    featured: true,
    order: 2,
  },
  "temoxa.com.png": {
    title: "Temoxa",
    description:
      "Free-to-shop e-commerce platform for electronics, digital games, and gaming accessories, with product browsing, cart, accounts, and a gaming hub for recharge and rewards.",
    technologies: ["Next.js", "React"],
    liveUrl: "https://temoxa.com/",
    githubUrl: null,
    featured: true,
    order: 3,
  },
  "my-portfolio.png": {
    title: "My Portfolio",
    description:
      "Arabic professional profile for a business development leader, with biography, management experience, qualifications, methodology, contact, and a downloadable PDF resume.",
    technologies: ["Next.js", "React"],
    liveUrl: "https://my-porfolio-95wr.vercel.app/",
    githubUrl: null,
    featured: true,
    order: 4,
  },
  "dhiid.org.png": {
    title: "dhiid.org",
    description:
      "A custom corporate WordPress solution built using specialized layouts and performance optimization techniques for corporate communications.",
    technologies: ["WordPress", "Custom CSS", "Elementor", "MySQL"],
    liveUrl: "https://dhiid.org",
    order: 10,
  },
  "flyandbeyond.com.png": {
    title: "flyandbeyond.com",
    description:
      "A travel booking and consultancy platform with responsive travel itineraries, search mechanisms, and client intake channels.",
    technologies: ["Next.js", "React", "Tailwind CSS", "REST APIs"],
    liveUrl: "https://flyandbeyond.com",
    order: 11,
  },
  "serenago.com.png": {
    title: "serenago.com",
    description:
      "A modern travel booking and agency management system with full responsive grid layouts and robust database integrations.",
    technologies: ["Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://serenago.com",
    order: 12,
  },
  "servixsa.com.png": {
    title: "servixsa.com",
    description:
      "A maintenance and corporate management portal for services with custom service grids and localized appointment flows.",
    technologies: ["WordPress", "MySQL", "PHP", "CSS3"],
    liveUrl: "https://servixsa.com",
    order: 13,
  },
  "yasminalmadinah.com.png": {
    title: "yasminalmadinah.com",
    description:
      "An e-commerce WordPress theme utilizing custom product widgets, WooCommerce catalogs, and local payment pathways.",
    technologies: ["WordPress", "WooCommerce", "Elementor", "Performance"],
    liveUrl: "https://yasminalmadinah.com",
    order: 14,
  },
  "screenshot 2025-10-18 134815.png": {
    title: "Admin Operational Console",
    description:
      "A backend operations console for tracking database transactions, client API logs, and server health check metrics.",
    technologies: ["React", "Node.js", "Prisma ORM", "SQL Server"],
    liveUrl: "",
    githubUrl: null,
    order: 20,
  },
};

const FEATURED_VIDEO = {
  file: "github.comes1amnagmskill_z.mp4",
  project: {
    id: "featured-skill-z",
    title: "Skill Z",
    slug: "skill-z",
    description:
      "An intensive gamified learning and developer skill-tracking platform. It includes progress tracking dashboards, course achievements, RESTful API integrations, and JWT authentication flow.",
    thumbnail: null,
    videoUrl: "/websites data/github.comes1amnagmSkill_Z.mp4",
    technologies: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "JWT Auth",
      "Framer Motion",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/es1amnagm/Skill_Z",
    liveUrl: null,
    featured: true,
    published: true,
    order: 0,
  } satisfies CatalogProject,
};

function websitesDir() {
  return path.join(process.cwd(), "public", "websites data");
}

export function getFeaturedVideoProject(): CatalogProject | null {
  const dir = websitesDir();
  if (!fs.existsSync(dir)) return null;

  const match = fs.readdirSync(dir).find(
    (file) => file.toLowerCase() === FEATURED_VIDEO.file
  );
  if (!match) return null;

  return {
    ...FEATURED_VIDEO.project,
    videoUrl: `/websites data/${match}`,
  };
}

export function getCatalogProjects(): CatalogProject[] {
  const projectDir = websitesDir();
  let files: string[] = [];

  try {
    if (fs.existsSync(projectDir)) {
      files = fs.readdirSync(projectDir);
    }
  } catch (err) {
    console.error("Failed to read websites data directory", err);
  }

  const projects: CatalogProject[] = [];

  for (const file of files) {
    if (file.toLowerCase() === FEATURED_VIDEO.file) continue;

    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) continue;
    if (SKIP_IMAGE_FILES.has(file.toLowerCase())) continue;

    const metadataKey = file.toLowerCase();
    const fallbackTitle = file.substring(0, file.lastIndexOf("."));
    const meta = PROJECTS_METADATA[metadataKey] ?? {
      title: fallbackTitle,
      description: "Developed and optimized web application or platform component.",
      technologies: ["JavaScript", "HTML5", "CSS3"],
      liveUrl: `https://${fallbackTitle}`,
      githubUrl: null,
      order: 50,
    };

    projects.push({
      id: `fs-${file.replace(/\s+/g, "-")}`,
      title: meta.title,
      slug: fallbackTitle.replace(/\s+/g, "-").toLowerCase(),
      description: meta.description,
      thumbnail: `/websites data/${file}`,
      videoUrl: null,
      technologies: meta.technologies,
      githubUrl: meta.githubUrl ?? null,
      liveUrl: meta.liveUrl || null,
      featured: Boolean(meta.featured),
      published: true,
      order: meta.order ?? 50,
    });
  }

  return projects.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
