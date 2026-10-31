import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return apiError("No file provided");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return apiError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
    }

    if (file.size > 5 * 1024 * 1024) {
      return apiError("File size must be less than 5MB");
    }

    const url = await saveUploadedFile(file);
    return apiSuccess({ url }, 201);
  } catch (error) {
    console.error(error);
    return apiError("Failed to upload file", 500);
  }
}
