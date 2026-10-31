import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { getSiteSettings, upsertSiteSettings } from "@/lib/settings";
import { seoSchema, settingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return apiSuccess(settings);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch settings", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const type = body.type as "seo" | "settings" | undefined;

    if (type === "seo") {
      const parsed = seoSchema.safeParse(body.data);
      if (!parsed.success) {
        return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
      }
      await upsertSiteSettings(parsed.data);
    } else {
      const parsed = settingsSchema.safeParse(body.data ?? body);
      if (!parsed.success) {
        return apiError(parsed.error.errors[0]?.message ?? "Invalid data");
      }
      await upsertSiteSettings(parsed.data);
    }

    const settings = await getSiteSettings();
    return apiSuccess(settings);
  } catch (error) {
    console.error(error);
    return apiError("Failed to update settings", 500);
  }
}
