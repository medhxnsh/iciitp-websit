"use server";

import { requireAuth } from "@/lib/auth";
import { upsertFormLink } from "@/lib/cms/form-links";
import { updateEvent } from "@/lib/cms/events";
import { updateNotification } from "@/lib/cms/notifications";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export type FormSource =
  | "forms"            // lib/forms.ts → cms-forms Firestore override
  | "static-program"   // content/en/programs/<slug>.json → applyUrl
  | "static-event"     // content/en/events/<slug>.json → applyUrl
  | "cms-event"        // Firestore cms-events doc → applyUrl
  | "cms-notification"; // Firestore cms-notifications doc → externalUrl

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const FIELD_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*$/;

function parseRef(ref: string): { slug: string; field: string } | null {
  const [slug, field = "applyUrl"] = ref.split(":");
  if (!slug || !SLUG_PATTERN.test(slug)) return null;
  if (!FIELD_PATTERN.test(field)) return null;
  return { slug, field };
}

async function writeStaticJson(folder: "programs" | "events", slug: string, field: string, url: string) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_STATIC_WRITES !== "1") {
    throw new Error("Editing static JSON is disabled in production");
  }
  const filePath = path.join(process.cwd(), "content/en", folder, `${slug}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data[field] = url;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Centralized "edit any form/apply URL across the site" action. Routes the
 * write to the correct storage based on `source`. All slug/field components
 * of `sourceRef` are pattern-validated so they cannot escape the intended
 * content directory.
 */
export async function updateFormUrlAction(
  source: FormSource,
  sourceRef: string,  // key/slug/firestoreId (+ optional ":field" suffix)
  label: string,
  url: string
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    switch (source) {
      case "forms":
        await upsertFormLink(sourceRef, { label, url, active: true });
        break;

      case "static-program": {
        const parsed = parseRef(sourceRef);
        if (!parsed) return { success: false, error: "Invalid program reference" };
        await writeStaticJson("programs", parsed.slug, parsed.field, url);
        revalidatePath("/programs/[slug]", "page");
        break;
      }

      case "static-event": {
        const parsed = parseRef(sourceRef);
        if (!parsed) return { success: false, error: "Invalid event reference" };
        await writeStaticJson("events", parsed.slug, parsed.field, url);
        revalidatePath("/events");
        break;
      }

      case "cms-event":
        await updateEvent(sourceRef, { applyUrl: url });
        revalidatePath("/events");
        break;

      case "cms-notification":
        await updateNotification(sourceRef, { externalUrl: url });
        revalidatePath("/notifications");
        break;
    }
    revalidatePath("/admin/forms");
    return { success: true };
  } catch (err) {
    console.error("[updateFormUrlAction]", err);
    return { success: false, error: "Failed to save." };
  }
}
