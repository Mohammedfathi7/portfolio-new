import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return apiSuccess(skills);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch skills", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const skill = await prisma.skill.create({ data: parsed.data });
    return apiSuccess(skill, 201);
  } catch (error) {
    console.error(error);
    return apiError("Failed to create skill", 500);
  }
}
