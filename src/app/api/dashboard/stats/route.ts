import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/analytics";
import { apiError, apiSuccess } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const stats = await getDashboardStats();
    return apiSuccess(stats);
  } catch (error) {
    console.error(error);
    return apiError("Failed to fetch stats", 500);
  }
}
