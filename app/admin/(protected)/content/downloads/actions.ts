"use server";

import { requireAuth } from "@/lib/auth";
import { createDownload, updateDownload, deleteDownload, type DownloadInput } from "@/lib/cms/downloads";
import { revalidatePath } from "next/cache";

function revalidate() {
  revalidatePath("/downloads");
  revalidatePath("/admin/content/downloads");
}

export async function createDownloadAction(
  data: DownloadInput
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await createDownload(data);
    revalidate();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save download." };
  }
}

export async function updateDownloadAction(
  id: string,
  data: Partial<DownloadInput>
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await updateDownload(id, data);
    revalidate();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update download." };
  }
}

export async function deleteDownloadAction(id: string): Promise<void> {
  await requireAuth();
  try {
    await deleteDownload(id);
    revalidate();
  } catch (err) {
    console.error("[deleteDownloadAction]", err);
    throw new Error("Failed to delete download");
  }
}
