import { requireAuth } from "@/lib/auth";
import { AdminSidebar } from "../_sidebar";
import { AdminTopBar } from "../_topbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <html lang="en">
      <head />
      <body style={{ backgroundColor: "#f2faf5", margin: 0 }}>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar user={user} />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <AdminTopBar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
