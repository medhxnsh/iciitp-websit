import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  createdAt: string;
}

const DATA_DIR = join(process.cwd(), "data");
const ADMINS_PATH = join(DATA_DIR, "admins.json");

export function getAdmins(): AdminUser[] {
  try {
    return JSON.parse(readFileSync(ADMINS_PATH, "utf-8")) as AdminUser[];
  } catch {
    return [];
  }
}

export function getAdminByEmail(email: string): AdminUser | undefined {
  return getAdmins().find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );
}

export function saveAdmins(admins: AdminUser[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf-8");
}
