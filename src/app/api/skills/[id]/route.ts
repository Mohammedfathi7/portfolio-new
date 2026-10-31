import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(skill);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update skill", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await prisma.skill.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete skill", 500);
  }
}
