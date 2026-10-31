import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuthProvider } from "@/components/providers/session-provider";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        {session && <AdminSidebar />}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AuthProvider>
  );
}
