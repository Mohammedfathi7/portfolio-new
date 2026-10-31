import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const { url, alt, order } = body;

    if (!url) return apiError("Image URL is required");

    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url,
        alt: alt ?? null,
        order: order ?? 0,
      },
    });

    return apiSuccess(image, 201);
  } catch (error) {
    console.error(error);
    return apiError("Failed to add image", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");
    if (!imageId) return apiError("Image ID is required");

    await prisma.projectImage.delete({ where: { id: imageId } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete image", 500);
  }
}
