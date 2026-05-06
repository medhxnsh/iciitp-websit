import { requireAuth } from "@/lib/auth";
import { AdminSidebar } from "../_sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <html lang="en">
      <head />
      <body style={{ backgroundColor: "#f2faf5", margin: 0 }}>
        <div className="flex min-h-screen">
          <AdminSidebar user={user} />
          <div className="flex-1 flex flex-col min-w-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
