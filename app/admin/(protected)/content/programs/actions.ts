"use server";

import { requireAuth } from "@/lib/auth";
import { upsertCmsProgram, type CmsProgram } from "@/lib/cms/programs";
import { revalidatePath } from "next/cache";

export type ProgramFormData = Omit<CmsProgram, "slug" | "updatedAt">;

export async function saveProgramAction(
  slug: string,
  data: ProgramFormData
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await upsertCmsProgram(slug, data);
    revalidatePath(`/en/programs/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save. Please try again." };
  }
}
