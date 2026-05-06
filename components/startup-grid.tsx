"use client";

import React, { useState, useMemo } from "react";
import type { Startup, StartupScheme } from "@/lib/content-types";
import { SCHEME_LABELS } from "@/lib/content-types";
import { ExternalLink } from "./external-link";
import { Search } from "lucide-react";

interface StartupGridProps {
  startups: Startup[];
  filterScheme?: StartupScheme;
  showFilter?: boolean;
}

const SECTOR_COLORS: Record<string, string> = {
  "AI/ML": "bg-purple-50 text-purple-800 border-purple-200",
  "MedTech": "bg-red-50 text-red-800 border-red-200",
  "EV": "bg-green-50 text-green-800 border-green-200",
  "IoT": "bg-blue-50 text-blue-800 border-blue-200",
  "EdTech": "bg-yellow-50 text-yellow-800 border-yellow-200",
  "AgriTech": "bg-lime-50 text-lime-800 border-lime-200",
  "Robotics": "bg-orange-50 text-orange-800 border-orange-200",
};

const schemeStyles: Record<StartupScheme, React.CSSProperties> = {
  meity: { backgroundColor: "#3a5214", color: "white" },
  sisf: { backgroundColor: "#ea580c", color: "white" },
  "nidhi-prayas": { backgroundColor: "#1d4ed8", color: "white" },
  "nidhi-eir": { backgroundColor: "#3b82f6", color: "white" },
  genesis: { backgroundColor: "#2a3a0d", color: "white" },
};

export function StartupGrid({ startups, filterScheme, showFilter = false }: StartupGridProps) {
  const [query, setQuery] = useState("");
  const [activeScheme, setActiveScheme] = useState<StartupScheme | "all">(filterScheme ?? "all");

  const schemes = useMemo(
    () => Array.from(new Set(startups.map((s) => s.scheme))) as StartupScheme[],
    [startups]
  );

  const filtered = useMemo(() => {
    let list = startups;
    if (activeScheme !== "all") list = list.filter((s) => s.scheme === activeScheme);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.sectors.some((sec) => sec.toLowerCase().includes(q))
      );
    }
    return list;
  }, [startups, activeScheme, query]);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-muted]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search startups…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[--color-border] rounded-[--radius-md] bg-[--color-surface] focus:outline-none focus:ring-2 focus:ring-[--color-brand-500]"
            aria-label="Search startups"
          />
        </div>
        {showFilter && (
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by scheme">
            <button
              type="button"
              onClick={() => setActiveScheme("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${activeScheme === "all" ? "text-white border-transparent" : "border-[--color-border] text-[--color-text-subtle] hover:border-[--color-brand-400]"}`}
              style={activeScheme === "all" ? { backgroundColor: "#3a5214" } : undefined}
              aria-pressed={activeScheme === "all"}
            >
              All ({startups.length})
            </button>
            {schemes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveScheme(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${activeScheme === s ? "text-white border-transparent" : "border-[--color-border] text-[--color-text-subtle] hover:border-[--color-brand-400]"}`}
                style={activeScheme === s ? { backgroundColor: "#3a5214" } : undefined}
                aria-pressed={activeScheme === s}
              >
                {SCHEME_LABELS[s]} ({startups.filter((x) => x.scheme === s).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-[--color-muted] mb-4" aria-live="polite">
        Showing {filtered.length} startup{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-[--color-muted]">No startups match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((startup) => (
            <StartupCard key={`${startup.name}-${startup.scheme}`} startup={startup} />
          ))}
        </div>
      )}
    </div>
  );
}

function StartupCard({ startup }: { startup: Startup }) {
  const initials = startup.name
    .split(/[\s(]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="flex flex-col rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] hover:shadow-md hover:border-[--color-brand-300] transition-all p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-brand-100] text-[--color-brand-800] font-black text-sm flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[--color-text] text-sm leading-snug line-clamp-2">
            {startup.name}
          </h3>
          <span className="inline-block text-xs font-medium px-1.5 py-0.5 rounded mt-1" style={schemeStyles[startup.scheme]}>
            {SCHEME_LABELS[startup.scheme]}
          </span>
        </div>
      </div>

      <p className="text-xs text-[--color-text-subtle] leading-relaxed flex-1 mb-3 line-clamp-3">
        {startup.tagline}
      </p>

      <div className="flex flex-wrap gap-1">
        {startup.sectors.slice(0, 3).map((s) => (
          <span
            key={s}
            className={`text-xs px-1.5 py-0.5 rounded border ${SECTOR_COLORS[s] ?? "bg-[--color-surface-alt] text-[--color-text-subtle] border-[--color-border]"}`}
          >
            {s}
          </span>
        ))}
      </div>

      {startup.website && (
        <div className="mt-3 pt-3 border-t border-[--color-border]">
          <ExternalLink
            href={startup.website}
            className="text-xs text-[--color-primary] hover:underline"
          >
            Visit website
          </ExternalLink>
        </div>
      )}
    </article>
  );
}
