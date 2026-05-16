/**
 * Shared domain types and lookup tables — safe to import in both server and client code.
 * No Node.js built-ins; no firebase-admin imports.
 */
// Client-safe types and constants — no Node.js imports

export type StartupScheme = "meity" | "sisf" | "nidhi-prayas" | "nidhi-eir" | "genesis";

export const SCHEME_LABELS: Record<StartupScheme, string> = {
  meity: "MeitY Scheme",
  sisf: "SISF Scheme",
  "nidhi-prayas": "Nidhi Prayas",
  "nidhi-eir": "Nidhi EIR",
  genesis: "GENESIS",
};

export interface Startup {
  name: string;
  scheme: StartupScheme;
  tagline: string;
  sectors: string[];
  founders: string[];
  website?: string;
  logo?: string;
}

export interface Download {
  title: string;
  path: string;
  format: string;
  size?: string;
  purpose: string;
  category: string;
  lastUpdated?: string;
}
