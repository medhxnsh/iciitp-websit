/**
 * CMS data layer for editable page sections (home hero, about, contact).
 * Each section is stored as a single Firestore document keyed by page name.
 */
import { getDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "./collections";

const COL = COLLECTIONS.pageSections;

// ── Home ──────────────────────────────────────────────────────────────────────

export interface HomeStat { value: string; label: string }

export interface HomeSection {
  about_headline: string;
  about_body_1: string;
  about_body_2: string;
  cta_headline: string;
  cta_body: string;
  building_image_url: string;
  team_staff_image_url: string;
  team_group_image_url: string;
  stats: HomeStat[];
  updatedAt?: Timestamp;
}

// ── Contact ───────────────────────────────────────────────────────────────────

export interface ContactSection {
  address: string;
  phone: string;
  email: string;
  hours: string;
  maps_embed_url: string;
  updatedAt?: Timestamp;
}

// ── About ─────────────────────────────────────────────────────────────────────

export interface AboutSection {
  building_image_url: string;
  inauguration_image_url: string;
  inauguration_caption: string;
  ceremony_image_url: string;
  ceremony_overlay_title: string;
  ceremony_overlay_body: string;
  updatedAt?: Timestamp;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

type SectionKey = "home" | "contact" | "about";
type SectionData = HomeSection | ContactSection | AboutSection;

export async function getPageSection(key: "home"): Promise<HomeSection | null>;
export async function getPageSection(key: "contact"): Promise<ContactSection | null>;
export async function getPageSection(key: "about"): Promise<AboutSection | null>;
export async function getPageSection(key: SectionKey): Promise<SectionData | null> {
  const doc = await getDb().collection(COL).doc(key).get();
  if (!doc.exists) return null;
  return doc.data() as SectionData;
}

export async function upsertPageSection(key: SectionKey, data: Omit<SectionData, "updatedAt">): Promise<void> {
  await getDb()
    .collection(COL)
    .doc(key)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
