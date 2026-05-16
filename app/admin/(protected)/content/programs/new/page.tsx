"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { saveProgramAction } from "../actions";

export default function NewProgramPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSlugInput(value: string) {
    // Auto-format to URL-safe slug
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const s = slug.trim().replace(/^-+|-+$/g, "");
    if (!s) { setError("Slug is required."); return; }
    if (!/^[a-z0-9-]+$/.test(s)) { setError("Slug can only contain lowercase letters, numbers, and hyphens."); return; }
    setError("");
    startTransition(async () => {
      // Create a minimal CMS record so the program exists in Firestore
      await saveProgramAction(s, {
        published: false,
        images: [], imageLayout: "banner",
        title: "", tagline: "", about: "",
        status: "", statusNote: "",
        applyUrl: "", applicationFormUrl: "", contactEmail: "",
        grant: "", schemeOutlay: "", stipend: "", duration: "",
        eligibility: [], notEligible: [], objectives: [],
        targetAudience: [], expectedOutcomes: [],
        support: [], preferences: [], notes: [], disclaimer: [],
      });
      router.push(`/admin/content/programs/${s}`);
    });
  }

  return (
    <main className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/content/programs" className="text-sm" style={{ color: "#7a8e6a" }}>
          ← Programs
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <BookOpen className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black" style={{ color: "#1c2e06" }}>New Program</h1>
      </div>

      <p className="text-sm mb-6" style={{ color: "#7a8e6a" }}>
        Choose a URL slug for the new programme. This becomes the public URL:
        <span className="font-mono ml-1" style={{ color: "#3a5214" }}>/programs/{slug || "your-slug"}</span>
      </p>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: "#5a7c20" }}>
            Programme slug <span style={{ color: "#b91c1c" }}>*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugInput(e.target.value)}
            placeholder="e.g. new-scheme-2025"
            className="w-full text-sm rounded-lg px-3 py-2.5 outline-none border"
            style={{ borderColor: "#d4e6c4", backgroundColor: "#fafff6" }}
            autoFocus
            required
          />
          <p className="text-xs mt-1.5" style={{ color: "#aab89e" }}>
            Use lowercase letters, numbers, and hyphens only. Cannot be changed later.
          </p>
        </div>

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={pending || !slug.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "#3a5214" }}
        >
          {pending ? "Creating…" : "Create & Edit Programme"}
        </button>
      </form>
    </main>
  );
}
