import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { certificateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
    });
    return apiSuccess(certificates);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch certificates", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = certificateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const certificate = await prisma.certificate.create({
      data: {
        ...parsed.data,
        issueDate: new Date(parsed.data.issueDate),
        verificationUrl: parsed.data.verificationUrl || null,
      },
    });

    return apiSuccess(certificate, 201);
  } catch (error) {
    console.error(error);
    return apiError("Failed to create certificate", 500);
  }
}
