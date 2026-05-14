import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const COL = "cms-programs";

export interface ProgramImage {
  url: string;
  alt?: string;
}

export interface CmsProgram {
  slug: string;
  images?: ProgramImage[];
  imageLayout?: "banner" | "grid" | "carousel";
  title?: string;
  tagline?: string;
  about?: string;
  status?: string;
  statusNote?: string;
  applyUrl?: string;
  contactEmail?: string;
  grant?: string;
  schemeOutlay?: string;
  stipend?: string;
  duration?: string;
  eligibility?: string[];
  notEligible?: string[];
  preferences?: string[];
  objectives?: string[];
  targetAudience?: string[];
  expectedOutcomes?: string[];
  support?: string[];
  notes?: string[];
  disclaimer?: string[];
  updatedAt?: Timestamp;
}

export type CmsProgramDoc = CmsProgram & { id: string };

export async function getCmsProgramBySlug(slug: string): Promise<CmsProgramDoc | null> {
  const snap = await getDb()
    .collection(COL)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as CmsProgram) };
}

export async function getAllCmsPrograms(): Promise<CmsProgramDoc[]> {
  const snap = await getDb().collection(COL).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsProgram) }));
}

/** Creates or updates the CMS record for a program slug. */
export async function upsertCmsProgram(
  slug: string,
  data: Omit<CmsProgram, "slug" | "updatedAt">
): Promise<void> {
  const snap = await getDb()
    .collection(COL)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const payload = { ...data, slug, updatedAt: FieldValue.serverTimestamp() };
  if (snap.empty) {
    await getDb().collection(COL).add(payload);
  } else {
    await snap.docs[0].ref.update(payload);
  }
}
