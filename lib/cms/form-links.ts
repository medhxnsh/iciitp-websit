/**
 * CMS data layer for Google Form / external application links.
 * Auto-discovered by the admin Forms page; edits propagate to the source (static JSON or Firestore).
 */
import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "./collections";

const COL = COLLECTIONS.formLinks;

export interface CmsFormLink {
  key: string;
  label: string;
  url: string;
  active: boolean;
  updatedAt?: Timestamp;
}

export type CmsFormLinkDoc = CmsFormLink & { id: string };

export async function getAllFormLinks(): Promise<CmsFormLinkDoc[]> {
  const snap = await getDb().collection(COL).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsFormLink) }));
}

export async function upsertFormLink(
  key: string,
  data: { label: string; url: string; active: boolean }
): Promise<void> {
  const snap = await getDb()
    .collection(COL)
    .where("key", "==", key)
    .limit(1)
    .get();
  const payload = { ...data, key, updatedAt: FieldValue.serverTimestamp() };
  if (snap.empty) {
    await getDb().collection(COL).add(payload);
  } else {
    await snap.docs[0].ref.update(payload);
  }
}

export async function createFormLink(data: {
  key: string;
  label: string;
  url: string;
  active: boolean;
}): Promise<string> {
  const ref = await getDb()
    .collection(COL)
    .add({ ...data, updatedAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function deleteFormLink(id: string): Promise<void> {
  await getDb().collection(COL).doc(id).delete();
}
