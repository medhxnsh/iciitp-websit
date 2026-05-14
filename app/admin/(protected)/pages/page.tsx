import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { FileEdit, Home, Phone, BookOpen, ArrowRight } from "lucide-react";

export const metadata = { title: "Page Editors — IC IITP Admin" };

const PAGES = [
  {
    title: "Home",
    description: "About section text, stats, images, and apply CTA.",
    href: "/admin/pages/home",
    liveHref: "/en",
    icon: <Home className="w-5 h-5" />,
  },
  {
    title: "Contact",
    description: "Address, phone, email, office hours, and map embed.",
    href: "/admin/pages/contact",
    liveHref: "/en/contact",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    title: "About",
    description: "Key images (building, inauguration, ceremony) and caption text.",
    href: "/admin/pages/about",
    liveHref: "/en/about",
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export default async function PagesIndexPage() {
  await requireAuth();
  return (
    <main className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <FileEdit className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Page Editors</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#7a8e6a" }}>
        Edit key sections of static pages. Changes save to Firestore and go live instantly.
      </p>

      <div className="space-y-3">
        {PAGES.map((page) => (
          <div
            key={page.href}
            className="flex items-center justify-between gap-4 p-5 rounded-xl border"
            style={{ borderColor: "#d4e6c4", backgroundColor: "white" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                {page.icon}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#1c2e06" }}>{page.title}</p>
                <p className="text-sm" style={{ color: "#7a8e6a" }}>{page.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={page.liveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-md border"
                style={{ borderColor: "#c4d9b0", color: "#3a5214" }}
              >
                View live
              </a>
              <Link
                href={page.href}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ backgroundColor: "#3a5214", color: "white" }}
              >
                Edit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
