"use server";

import { requireAuth } from "@/lib/auth";
import {
  createNotification,
  updateNotification,
  deleteNotification,
  type NotificationInput,
  type NotificationType,
  TYPE_PATHS,
} from "@/lib/cms/notifications";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

export interface NotificationFormData {
  title: string;
  body: string;
  type: NotificationType;
  deadline: string | null;
  validFrom: string | null;
  contactEmail: string;
  externalUrl: string;
  attachmentUrl: string;
  published: boolean;
}

function toInput(data: NotificationFormData): NotificationInput {
  return {
    ...data,
    deadline: data.deadline ? Timestamp.fromDate(new Date(data.deadline)) : null,
    validFrom: data.validFrom ? Timestamp.fromDate(new Date(data.validFrom)) : null,
  };
}

function revalidateAll() {
  for (const path of Object.values(TYPE_PATHS)) {
    revalidatePath(`/en/notifications/${path}`);
  }
  revalidatePath("/admin/content/notifications");
}

export async function createNotificationAction(
  data: NotificationFormData
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await createNotification(toInput(data));
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create notification." };
  }
}

export async function updateNotificationAction(
  id: string,
  data: NotificationFormData
): Promise<{ success: boolean; error?: string }> {
  await requireAuth();
  try {
    await updateNotification(id, toInput(data));
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update notification." };
  }
}

export async function deleteNotificationAction(id: string): Promise<void> {
  await requireAuth();
  await deleteNotification(id);
  revalidateAll();
}
