#!/usr/bin/env tsx
/**
 * CLI to add or update admin users in data/admins.json
 * Usage: npx tsx scripts/admin-add-user.ts --email x@iitp.ac.in --name "Name" --password "..." --role admin
 */

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { getAdmins, saveAdmins, type AdminUser } from "../lib/admins";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i]?.replace(/^--/, "");
    const val = process.argv[i + 1];
    if (key && val) args[key] = val;
  }
  return args;
}

async function main() {
  const { email, name, password, role } = parseArgs();

  if (!email || !name || !password) {
    console.error("Usage: npx tsx scripts/admin-add-user.ts --email <email> --name <name> --password <password> [--role admin|editor]");
    process.exit(1);
  }

  const normalizedRole = (role === "admin" ? "admin" : "editor") as AdminUser["role"];
  const passwordHash = await bcrypt.hash(password, 12);

  const admins = getAdmins();
  const existing = admins.findIndex((a) => a.email.toLowerCase() === email.toLowerCase());

  if (existing >= 0) {
    admins[existing] = {
      ...admins[existing],
      name,
      passwordHash,
      role: normalizedRole,
    };
    saveAdmins(admins);
    console.log(`✅ Updated user: ${email} (${normalizedRole})`);
  } else {
    const newUser: AdminUser = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: normalizedRole,
      createdAt: new Date().toISOString(),
    };
    admins.push(newUser);
    saveAdmins(admins);
    console.log(`✅ Created user: ${email} (${normalizedRole})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
