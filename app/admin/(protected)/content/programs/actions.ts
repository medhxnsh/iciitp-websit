"use server";

import { requireAuth } from "@/lib/auth";
import { upsertCmsProgram, deleteCmsProgram, type CmsProgram } from "@/lib/cms/programs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProgramFormData = Omit<CmsProgram, "slug" | "updatedAt">;

function revalidateAll(slug: string) {
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/admin/content/programs");
}

export async function saveProgramAction(
  slug: string,
  data: ProgramFormData
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await upsertCmsProgram(slug, data);
    revalidateAll(slug);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save. Please try again." };
  }
}

export async function deleteProgramAction(slug: string): Promise<void> {
  await requireAuth();
  try {
    await deleteCmsProgram(slug);
    revalidatePath("/admin/content/programs");
    revalidatePath(`/programs/${slug}`);
  } catch (err) {
    console.error("[deleteProgramAction]", err);
    throw new Error("Failed to delete program");
  }
  redirect("/admin/content/programs");
}
