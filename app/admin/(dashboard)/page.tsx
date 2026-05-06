import { requireAuth } from "@/lib/auth";
import { getAllPrograms, getAllEvents, getAllNotifications, getAllStartups } from "@/lib/content";
import {
  BookOpen, Calendar, Bell, Rocket,
  ArrowRight, ClipboardList, Upload, Link2,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard — IC IITP Admin" };

export default async function AdminDashboard() {
  const user = await requireAuth();
  const programs = getAllPrograms("en");
  const events = getAllEvents("en");
  const notifications = getAllNotifications("en");
  const startups = (() => { try { return getAllStartups("en"); } catch { return []; } })();

  const stats = [
    { label: "Programs", value: programs.length, href: "/admin/content/programs", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Events", value: events.length, href: "/admin/content/events", icon: <Calendar className="w-5 h-5" /> },
    { label: "Notifications", value: notifications.length, href: "/admin/content/notifications", icon: <Bell className="w-5 h-5" /> },
    { label: "Startups", value: startups.length, href: "/admin/content/startups", icon: <Rocket className="w-5 h-5" /> },
  ];

  const quickActions = [
    { label: "View applications", desc: "See who has applied to each scheme", href: "/admin/applications", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Add notification", desc: "Post a new career, tender, or announcement", href: "/admin/content/notifications", icon: <Bell className="w-5 h-5" /> },
    { label: "Upload a PDF", desc: "Add or replace forms and documents", href: "/admin/files/pdfs", icon: <Upload className="w-5 h-5" /> },
    { label: "Update form links", desc: "Swap out Google Form apply-now URLs", href: "/admin/forms", icon: <Link2 className="w-5 h-5" /> },
  ];

  return (
    <main className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1c2e06" }}>
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm" style={{ color: "#5a6644" }}>
          Here's a snapshot of your site content.
        </p>
      </div>

      {/* Stats */}
      <section aria-labelledby="stats-h" className="mb-10">
        <h2 id="stats-h" className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5a7c20" }}>
          Content overview
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-xl border p-5 flex items-start justify-between hover:shadow-sm transition-shadow"
              style={{ borderColor: "#e8f0e0" }}
            >
              <div>
                <p className="text-3xl font-black mb-0.5" style={{ color: "#3a5214" }}>
                  {value}
                </p>
                <p className="text-sm font-medium" style={{ color: "#5a6644" }}>{label}</p>
              </div>
              <span style={{ color: "#3a5214" }} aria-hidden="true">{icon}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-h">
        <h2 id="actions-h" className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5a7c20" }}>
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickActions.map(({ label, desc, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-xl border flex items-center gap-4 p-4 hover:shadow-sm transition-shadow"
              style={{ borderColor: "#e8f0e0" }}
            >
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                aria-hidden="true"
              >
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>{label}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "#7a8e6a" }}>{desc}</p>
              </div>
              <ArrowRight
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: "#f79420" }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
