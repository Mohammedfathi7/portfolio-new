import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { certificateSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = certificateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...parsed.data,
        issueDate: new Date(parsed.data.issueDate),
        verificationUrl: parsed.data.verificationUrl || null,
      },
    });

    return apiSuccess(certificate);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update certificate", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await prisma.certificate.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (error) {
    console.error(error);
    return apiError("Failed to delete certificate", 500);
  }
}
