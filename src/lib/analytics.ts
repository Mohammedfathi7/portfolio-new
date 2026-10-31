import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function trackVisitor(path: string) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown";
    const userAgent = headersList.get("user-agent") ?? undefined;
    const referrer = headersList.get("referer") ?? undefined;

    await prisma.visitor.create({
      data: { ip, userAgent, path, referrer },
    });
  } catch {
    // Silently fail visitor tracking
  }
}

export async function getVisitorCount(): Promise<number> {
  return prisma.visitor.count();
}

export async function getDashboardStats() {
  const [projects, certificates, messages, visitors] = await Promise.all([
    prisma.project.count(),
    prisma.certificate.count(),
    prisma.contactMessage.count(),
    prisma.visitor.count(),
  ]);

  const unreadMessages = await prisma.contactMessage.count({
    where: { read: false },
  });

  return { projects, certificates, messages, visitors, unreadMessages };
}
