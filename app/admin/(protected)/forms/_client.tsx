"use client";

import { useState, useTransition } from "react";
import { saveFormLinkAction } from "./actions";
import { Check, Loader2 } from "lucide-react";

interface Entry {
  key: string;
  label: string;
  url: string;
  active: boolean;
  customised: boolean;
}

export function FormLinksClient({ entries }: { entries: Entry[] }) {
  const [values, setValues] = useState<Record<string, { url: string; active: boolean }>>(
    Object.fromEntries(entries.map((e) => [e.key, { url: e.url, active: e.active }]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function setUrl(key: string, url: string) {
    setValues((v) => ({ ...v, [key]: { ...v[key], url } }));
  }

  function setActive(key: string, active: boolean) {
    setValues((v) => ({ ...v, [key]: { ...v[key], active } }));
  }

  function saveEntry(key: string, label: string) {
    setSaving(key);
    setSaved(null);
    setErrors((e) => ({ ...e, [key]: "" }));
    startTransition(async () => {
      const { url, active } = values[key];
      const result = await saveFormLinkAction(key, label, url, active);
      setSaving(null);
      if (result.success) {
        setSaved(key);
        setTimeout(() => setSaved(null), 2000);
      } else {
        setErrors((e) => ({ ...e, [key]: result.error ?? "Failed" }));
      }
    });
  }

  const inputStyle = { border: "1px solid #d4e6c4", color: "#1c2e06" };

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const val = values[entry.key];
        const isSaving = saving === entry.key;
        const isSaved = saved === entry.key;
        const err = errors[entry.key];

        return (
          <div key={entry.key} className="rounded-xl bg-white p-5" style={{ border: "1px solid #e8f0e0" }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>{entry.label}</p>
                <p className="text-[10px] font-mono" style={{ color: "#aab89e" }}>{entry.key}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val.active}
                    onChange={(e) => setActive(entry.key, e.target.checked)}
                    className="w-3.5 h-3.5"
                    style={{ accentColor: "#3a5214" }}
                  />
                  <span className="text-xs" style={{ color: "#5a6644" }}>Active</span>
                </label>
                {entry.customised && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                    Customised
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={val.url}
                onChange={(e) => setUrl(entry.key, e.target.value)}
                placeholder="https://forms.gle/…"
                className="flex-1 text-sm rounded-lg px-3 py-2 outline-none font-mono"
                style={inputStyle}
              />
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveEntry(entry.key, entry.label)}
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
  );
}
