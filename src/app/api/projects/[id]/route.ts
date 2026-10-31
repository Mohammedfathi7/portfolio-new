import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { images: { orderBy: { order: "asc" } } },
    });

    if (!project) return apiError("Project not found", 404);

    const session = await auth();
    if (!project.published && !session?.user) {
      return apiError("Project not found", 404);
    }

    return apiSuccess(project);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch project", 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);
    const existing = await prisma.project.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) return apiError("A project with this slug already exists");

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...parsed.data,
        slug,
        githubUrl: parsed.data.githubUrl || null,
        liveUrl: parsed.data.liveUrl || null,
      },
      include: { images: true },
    });

    return apiSuccess(project);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update project", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete project", 500);
  }
}
