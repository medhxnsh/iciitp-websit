/**
 * Server-side Firebase Admin SDK initialization.
 * Lazily initializes a single App + Firestore client; throws clearly when
 * required credentials are missing so misconfigured deploys fail at boot
 * instead of silently writing nowhere.
 */
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _app: App | null = null;
let _db: Firestore | null = null;

/** Returns the configured Firebase Storage bucket name. */
export function getStorageBucket(): string {
  if (process.env.FIREBASE_STORAGE_BUCKET) return process.env.FIREBASE_STORAGE_BUCKET;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "Firebase config missing: set FIREBASE_STORAGE_BUCKET or FIREBASE_PROJECT_ID env var."
    );
  }
  return `${projectId}.firebasestorage.app`;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Firebase config missing: ${name} env var is required.`);
  return v;
}

function ensureApp(): App {
  if (_app) return _app;
  const existing = getApps();
  if (existing.length > 0) {
    _app = existing[0];
    return _app;
  }
  _app = initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    storageBucket: getStorageBucket(),
  });
  return _app;
}

export function getDb(): Firestore {
  if (_db) return _db;
  ensureApp();
  _db = getFirestore();
  return _db;
}

export function getApp(): App {
  return ensureApp();
}
