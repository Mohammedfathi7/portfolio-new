import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { contactSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(messages);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch messages", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
    }

    const message = await prisma.contactMessage.create({
      data: parsed.data,
    });

    return apiSuccess({ success: true, id: message.id }, 201);
  } catch (error) {
    console.error(error);
    return apiError("Failed to send message", 500);
  }
}
