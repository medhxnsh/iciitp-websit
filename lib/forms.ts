/**
 * Static Google Forms / external form links used across the public site.
 * The CMS form-links module (lib/cms/form-links.ts) adds runtime overrides on top of these.
 */
export interface FormEntry {
  label: string;
  url: string;
  /** Google Sheet ID backing this form's responses (for admin applications viewer) */
  sheetId?: string;
  /** Name of the tab/sheet within the spreadsheet */
  sheetName?: string;
}

export const FORMS: Record<string, FormEntry> = {
  flagshipIncubation: {
    label: "Flagship Incubation",
    url: "https://forms.gle/N3zGMVek5rDjJRDW8",
    sheetId: "",
    sheetName: "Sheet1",
  },
  ideathon: {
    label: "IdeaThon",
    url: "https://forms.gle/NTrATcbqD4nhDDA68",
    sheetId: "",
    sheetName: "Sheet1",
  },
  edpi2025: {
    label: "EDPI 2025",
    url: "https://forms.gle/tpGDpPouRDWDJ91t7",
    sheetId: "",
    sheetName: "Sheet1",
  },
  internship: {
    label: "Internship",
    url: "https://shorturl.at/Nexyn",
    sheetId: "",
    sheetName: "Sheet1",
  },
  // Genesis — three separate forms; URLs to be provided by staff
  genesisEir: {
    label: "GENESIS EIR",
    url: "https://forms.gle/NjpT51zChStHD7AM6",
    sheetId: "",
    sheetName: "Sheet1",
  },
  genesisPilot: {
    label: "GENESIS Pilot",
    url: "https://forms.gle/jXWo5z6B4nPTZC2f9",
    sheetId: "",
    sheetName: "Sheet1",
  },
  genesisMatching: {
    label: "GENESIS Matching Investment",
    url: "https://forms.gle/rcGeBeQ32hqyWrvs9",
    sheetId: "",
    sheetName: "Sheet1",
  },
  // Feedback — URL to be provided by staff
  feedback: {
    label: "Site Feedback",
    url: "",
    sheetId: "",
    sheetName: "Sheet1",
  },
};

/** Typed helper used in the feedback page */
export const FORMS_URL = (key: keyof typeof FORMS): string => FORMS[key]?.url ?? "";

// PDF download links
export const DOWNLOADS = {
  gstCertificate: "https://iciitp.com/wp-content/uploads/2024/03/GST-Incubation-Centre-IIT-Patna.pdf",
  nidhiPrayas2025: "/pdfs/Appliation-Form-Nidhi-Prayas-2025with_Annexure.pdf",
  bionestCall2: "/pdfs/BIRAC-BiONEST-2.pdf",
  nidhiEirApplication: "/pdfs/ICIITP-Nidhi-EIR-Application1-1.pdf",
} as const;
