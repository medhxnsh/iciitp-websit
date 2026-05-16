"use client";

import { useState, useTransition } from "react";
import { updateFormUrlAction } from "./actions";
import type { FormEntry } from "./page";
import { Check, Loader2 } from "lucide-react";

export function FormLinksClient({
  entries,
  groups,
}: {
  entries: FormEntry[];
  groups: string[];
}) {
  const [urls, setUrls] = useState<Record<string, string>>(
    Object.fromEntries(entries.map((e) => [e.id, e.url]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function save(entry: FormEntry) {
    setSaving(entry.id);
    setSaved(null);
    setErrors((e) => ({ ...e, [entry.id]: "" }));
    startTransition(async () => {
      const result = await updateFormUrlAction(
        entry.source,
        entry.sourceRef,
        entry.label,
        urls[entry.id]
      );
      setSaving(null);
      if (result.success) {
        setSaved(entry.id);
        setTimeout(() => setSaved(null), 2000);
      } else {
        setErrors((e) => ({ ...e, [entry.id]: result.error ?? "Failed" }));
      }
    });
  }

  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };
  const sourceLabels: Record<string, string> = {
    "forms": "Static form",
    "static-program": "Program JSON",
    "static-event": "Event JSON",
    "cms-event": "CMS event",
    "cms-notification": "CMS notification",
  };

  return (
    <div className="space-y-10">
      {groups.map((group) => {
        const groupEntries = entries.filter((e) => e.group === group);
        if (groupEntries.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: "#3a5214", borderColor: "#d4e6c4" }}>
              {group}
            </h2>
            <div className="space-y-3">
              {groupEntries.map((entry) => {
                const isSaving = saving === entry.id;
                const isSaved = saved === entry.id;
                const err = errors[entry.id];
                return (
                  <div key={entry.id} className="rounded-xl bg-white p-4" style={{ border: "1px solid #e8f0e0" }}>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>{entry.label}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "#f0f7e6", color: "#5a6644" }}>
                        {sourceLabels[entry.source]}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urls[entry.id]}
                        onChange={(e) => setUrls((v) => ({ ...v, [entry.id]: e.target.value }))}
                        placeholder="https://…"
                        className="flex-1 text-sm rounded-lg px-3 py-2 outline-none font-mono"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => save(entry)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white shrink-0 disabled:opacity-60"
                        style={{ backgroundColor: "#3a5214" }}
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isSaved ? (
                          <><Check className="w-3.5 h-3.5" /> Saved</>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                    {err && <p className="text-xs mt-1.5" style={{ color: "#b91c1c" }}>{err}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
