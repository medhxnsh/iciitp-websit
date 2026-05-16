/**
 * Firestore collection names used across the CMS data layer.
 * Change a collection name here and it propagates everywhere.
 */
export const COLLECTIONS = {
  events:         "cms-events",
  eventOverlays:  "cms-event-overlays",
  notifications:  "cms-notifications",
  programs:       "cms-programs",
  downloads:      "cms-downloads",
  formLinks:      "cms-forms",
  pageSections:   "cms-page-sections",
} as const;
