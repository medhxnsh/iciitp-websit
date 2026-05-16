/**
 * CMS data layer for downloadable files (PDFs, forms, reports).
 * Files are tagged with a displayPage key so each page can filter its own documents.
 */
import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "./collections";

const COL = COLLECTIONS.downloads;

export interface CmsDownload {
  title: string;
  fileUrl: string;
  fileType: string;
  category: string;
  purpose: string;
  published: boolean;
  /** page key where this file is featured, e.g. "downloads", "programs/nidhi-prayas", "notifications/careers" */
  displayPage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CmsDownloadDoc = CmsDownload & { id: string };

export async function getPublishedDownloads(): Promise<CmsDownloadDoc[]> {
  const snap = await getDb()
    .collection(COL)
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsDownload) }));
  // General downloads page shows files with no displayPage or explicitly assigned to "downloads"
  return docs.filter((d) => !d.displayPage || d.displayPage === "downloads");
}

/** Returns published files assigned to a specific page key, e.g. "programs/nidhi-prayas" */
export async function getDownloadsByPage(page: string): Promise<CmsDownloadDoc[]> {
  const snap = await getDb()
    .collection(COL)
    .where("published", "==", true)
    .where("displayPage", "==", page)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsDownload) }));
}

export async function getAllAdminDownloads(): Promise<CmsDownloadDoc[]> {
  const snap = await getDb().collection(COL).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CmsDownload) }));
}

export async function getDownloadById(id: string): Promise<CmsDownloadDoc | null> {
  const doc = await getDb().collection(COL).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as CmsDownload) };
}

export type DownloadInput = Omit<CmsDownload, "createdAt" | "updatedAt">;

export async function createDownload(data: DownloadInput): Promise<string> {
  const ref = await getDb().collection(COL).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateDownload(
  id: string,
  data: Partial<DownloadInput>
): Promise<void> {
  await getDb().collection(COL).doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteDownload(id: string): Promise<void> {
  await getDb().collection(COL).doc(id).delete();
}
