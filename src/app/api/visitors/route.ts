import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-utils";
import { trackVisitor } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = body.path ?? "/";
    await trackVisitor(path);
    return apiSuccess({ success: true });
  } catch {
    return apiSuccess({ success: true });
  }
}
