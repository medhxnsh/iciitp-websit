"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  BookOpen,
  Calendar,
  Users,
  Download,
  Rocket,
  FileText,
  Image,
  Link2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import type { AdminSession } from "@/lib/auth";
import { logoutAction } from "./login/actions";

interface SidebarProps {
  user: AdminSession;
}

type NavItem =
  | { type: "link"; label: string; href: string; icon: React.ReactNode }
  | { type: "group"; label: string; icon: React.ReactNode; children: { label: string; href: string }[] };

const NAV: NavItem[] = [
  { type: "link", label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
  { type: "link", label: "Applications", href: "/admin/applications", icon: <ClipboardList className="w-4 h-4" /> },
  {
    type: "group",
    label: "Content",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      { label: "Notifications", href: "/admin/content/notifications" },
      { label: "Programs", href: "/admin/content/programs" },
      { label: "Events", href: "/admin/content/events" },
      { label: "Team", href: "/admin/content/team" },
      { label: "Downloads", href: "/admin/content/downloads" },
      { label: "Startups", href: "/admin/content/startups" },
    ],
  },
  {
    type: "group",
    label: "Files",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: "PDFs", href: "/admin/files/pdfs" },
      { label: "Images", href: "/admin/files/images" },
    ],
  },
  { type: "link", label: "Form Links", href: "/admin/forms", icon: <Link2 className="w-4 h-4" /> },
];

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      style={
        active
          ? { backgroundColor: "rgba(255,255,255,0.15)", color: "white" }
          : { color: "rgba(255,255,255,0.70)" }
      }
    >
      {icon}
      {label}
    </Link>
  );
}

function NavGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: { label: string; href: string }[] }) {
  const pathname = usePathname();
  const anyActive = children.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(anyActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ color: anyActive ? "white" : "rgba(255,255,255,0.70)" }}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-0.5 ml-7 space-y-0.5">
          {children.map((c) => {
            const active = pathname.startsWith(c.href);
            return (
              <Link
                key={c.href}
                href={c.href}
                className="block px-3 py-1.5 rounded-md text-sm transition-colors"
                style={
                  active
                    ? { backgroundColor: "rgba(255,255,255,0.15)", color: "white" }
                    : { color: "rgba(255,255,255,0.60)" }
                }
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar({ user }: SidebarProps) {
  return (
    <aside
      className="w-60 shrink-0 flex flex-col min-h-screen"
      style={{ backgroundColor: "#3a5214" }}
    >
      {/* Wordmark */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
        <p className="font-black text-white text-sm leading-tight">IC IITP</p>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
          Staff Portal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {NAV.map((item) =>
          item.type === "link" ? (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ) : (
            <NavGroup key={item.label} label={item.label} icon={item.icon} children={item.children} />
          )
        )}
      </nav>

      {/* User pill + sign out */}
      <div className="px-3 pb-5 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
        <div className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "#f79420", color: "white" }}
            aria-hidden="true"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] capitalize" style={{ color: "rgba(255,255,255,0.55)" }}>
              {user.role}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
