import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read ?? true },
    });

    return apiSuccess(message);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update message", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete message", 500);
  }
}
