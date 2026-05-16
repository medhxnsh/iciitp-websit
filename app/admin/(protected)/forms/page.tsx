import { requireAuth } from "@/lib/auth";
import { getAllFormLinks } from "@/lib/cms/form-links";
import { getAdminEvents } from "@/lib/cms/events";
import { getPublishedNotifications } from "@/lib/cms/notifications";
import { FORMS } from "@/lib/forms";
import { FormLinksClient } from "./_client";
import { Link2 } from "lucide-react";
import type { FormSource } from "./actions";
import fs from "fs";
import path from "path";

export const metadata = { title: "Form Links — IC IITP Admin" };
export const dynamic = "force-dynamic";

export interface FormEntry {
  id: string;
  label: string;
  url: string;
  source: FormSource;
  sourceRef: string;
  group: string;
}

function readStaticUrlEntries(dir: "programs" | "events", field = "applyUrl"): FormEntry[] {
  const folder = path.join(process.cwd(), "content/en", dir);
  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".json"));
  const entries: FormEntry[] = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(folder, file), "utf-8"));
      const url = data[field];
      if (url && typeof url === "string" && url.startsWith("http")) {
        const slug = file.replace(".json", "");
        const label = data.title ?? data.name ?? slug;
        entries.push({
          id: `${dir}-${slug}`,
          label: `${label} — Apply`,
          url,
          source: dir === "programs" ? "static-program" : "static-event",
          sourceRef: `${slug}:${field}`,
          group: dir === "programs" ? "Programs" : "Events",
        });
      }
    } catch { /* skip unreadable files */ }
  }
  return entries;
}

export default async function FormLinksPage() {
  await requireAuth();

  // 1. Static application forms (lib/forms.ts) — use cms-forms as override store
  const cmsLinks = await getAllFormLinks().catch(() => []);
  const cmsMap = new Map(cmsLinks.map((l) => [l.key, l]));
  const staticFormEntries: FormEntry[] = Object.entries(FORMS).map(([key, staticEntry]) => {
    const cms = cmsMap.get(key);
    return {
      id: `forms-${key}`,
      label: staticEntry.label,
      url: cms?.url ?? staticEntry.url,
      source: "forms",
      sourceRef: key,
      group: "Application Forms",
    };
  });

  // 2. Static programs with applyUrl + equipmentFormUrl
  const staticProgramEntries = [
    ...readStaticUrlEntries("programs"),
    ...readStaticUrlEntries("programs", "equipmentFormUrl").map((e) => ({
      ...e,
      id: `${e.id}-equipment`,
      label: e.label.replace("— Apply", "— Equipment Access"),
    })),
  ];

  // 3. Static events with applyUrl
  const staticEventEntries = readStaticUrlEntries("events");

  // 4. CMS events with applyUrl
  const cmsEvents = await getAdminEvents().catch(() => []);
  const cmsEventEntries: FormEntry[] = cmsEvents
    .filter((e) => e.applyUrl)
    .map((e) => ({
      id: `cms-event-${e.id}`,
      label: `${e.title} — Apply`,
      url: e.applyUrl,
      source: "cms-event" as FormSource,
      sourceRef: e.id,
      group: "Events",
    }));

  // 5. CMS notifications with externalUrl
  const cmsNotifs = await getPublishedNotifications().catch(() => []);
  const cmsNotifEntries: FormEntry[] = cmsNotifs
    .filter((n) => n.externalUrl)
    .map((n) => ({
      id: `cms-notif-${n.id}`,
      label: `${n.title} — Portal`,
      url: n.externalUrl!,
      source: "cms-notification" as FormSource,
      sourceRef: n.id,
      group: "Notifications",
    }));

  // Deduplicate: CMS events override matching static event entries by URL
  const allEntries = [
    ...staticFormEntries,
    ...staticProgramEntries,
    ...staticEventEntries,
    ...cmsEventEntries,
    ...cmsNotifEntries,
  ];

  const groups = ["Application Forms", "Programs", "Events", "Notifications"];

  return (
    <main className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Form Links</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#7a8e6a" }}>
        Every form and apply link across the site — auto-discovered. Edit any URL here and it updates instantly everywhere it appears.
      </p>
      <FormLinksClient entries={allEntries} groups={groups} />
    </main>
  );
}
