import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/analytics";
import { Award, Eye, FolderKanban, Mail } from "lucide-react";

export default async function AdminDashboardPage() {
  let stats = { projects: 0, certificates: 0, messages: 0, visitors: 0, unreadMessages: 0 };
  try {
    stats = await getDashboardStats();
  } catch {
    // Database not connected
  }

  const cards = [
    { title: "Total Projects", value: stats.projects, icon: FolderKanban },
    { title: "Total Certificates", value: stats.certificates, icon: Award },
    { title: "Total Messages", value: stats.messages, icon: Mail, sub: `${stats.unreadMessages} unread` },
    { title: "Total Visitors", value: stats.visitors, icon: Eye },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio website</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
