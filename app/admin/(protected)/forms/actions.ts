"use server";

import { requireAuth } from "@/lib/auth";
import { upsertFormLink } from "@/lib/cms/form-links";
import { revalidatePath } from "next/cache";

export async function saveFormLinkAction(
  key: string,
  label: string,
  url: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await upsertFormLink(key, { label, url, active });
    revalidatePath("/admin/forms");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save." };
  }
}
