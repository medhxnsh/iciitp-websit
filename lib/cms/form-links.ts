import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const COL = "cms-forms";

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
