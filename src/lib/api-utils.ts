import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function withAuth(
  handler: (req: NextRequest, session: Session) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await auth();
      if (!session?.user) {
        return apiError("Unauthorized", 401);
      }
      return handler(req, session);
    } catch (error) {
      console.error(error);
      return apiError("Internal server error", 500);
    }
  };
}
