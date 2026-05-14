export type NotificationType = "careers" | "tender" | "proposal";

export const TYPE_PATHS: Record<NotificationType, string> = {
  careers: "careers",
  tender: "niq-tender",
  proposal: "call-for-proposals",
};
