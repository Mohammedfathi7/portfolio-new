import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return apiSuccess(experience);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update experience", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete experience", 500);
  }
}
