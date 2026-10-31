import { NextRequest } from "next/server";
import { prisma, withPrismaTimeout } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { getCatalogProjects, getFeaturedVideoProject, type CatalogProject } from "@/lib/project-catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const tech = searchParams.get("tech") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "9", 10);

    const projectsList: CatalogProject[] = getCatalogProjects();
    let featuredProject = getFeaturedVideoProject();

    try {
      const dbProjects = await withPrismaTimeout(() =>
        prisma.project.findMany({
          where: { published: true },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        })
      );

      dbProjects.forEach((dbP) => {
        if (!projectsList.some((p) => p.title.toLowerCase() === dbP.title.toLowerCase())) {
          projectsList.push({
            id: dbP.id,
            title: dbP.title,
            slug: dbP.slug,
            description: dbP.description,
            thumbnail: dbP.thumbnail,
            videoUrl: null,
            technologies: dbP.technologies,
            githubUrl: dbP.githubUrl,
            liveUrl: dbP.liveUrl,
            featured: dbP.featured,
            published: dbP.published,
            order: dbP.order,
          });
        }
      });
      projectsList.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    } catch {
      // Database connection error bypass
    }

    if (!featuredProject) {
      featuredProject = projectsList.find((p) => p.featured) ?? null;
    }

    let filteredList = projectsList;

    if (search) {
      const query = search.toLowerCase();
      filteredList = filteredList.filter(
        (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    if (tech) {
      filteredList = filteredList.filter((p) => p.technologies.includes(tech));
    }

    const allTechs = new Set<string>();
    projectsList.forEach((p) => p.technologies.forEach((t) => allTechs.add(t)));
    featuredProject?.technologies.forEach((t) => allTechs.add(t));
    const technologies = Array.from(allTechs).sort();

    const total = filteredList.length;
    const paginatedList = filteredList.slice((page - 1) * limit, page * limit);

    return apiSuccess({
      featuredProject,
      projects: paginatedList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      technologies,
    });
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch projects", 500);
  }
}

export async function POST(_req: NextRequest) {
  return apiError("Method not allowed in static file scanner", 405);
}
