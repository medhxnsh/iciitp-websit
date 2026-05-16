/**
 * Admin session helpers (iron-session backed cookies).
 * Production REQUIRES IRON_SESSION_PASSWORD env var; dev falls back to a
 * dummy password and warns on first use so missing config is loud.
 */
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

function resolveSessionPassword(): string {
  const fromEnv = process.env.IRON_SESSION_PASSWORD;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    // Fail loud — refusing to sign cookies with a guessable password.
    throw new Error(
      "IRON_SESSION_PASSWORD is missing or too short (≥32 chars required in production). " +
      "Set it in the environment before starting the server."
    );
  }

  if (!resolveSessionPassword.warned) {
    console.warn(
      "[auth] IRON_SESSION_PASSWORD not set — using dev-only fallback. " +
      "Production deploys will refuse to boot without this env var."
    );
    resolveSessionPassword.warned = true;
  }
  return "dev-only-fallback-password-32-chars!!";
}
resolveSessionPassword.warned = false as boolean;

export const SESSION_OPTIONS = {
  password: resolveSessionPassword(),
  cookieName: "iciitp_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8-hour sessions
  },
};

export async function getSession(): Promise<IronSession<AdminSession>> {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
}

/** Call from Server Components/layouts — redirects to /admin/login if no session. */
export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}
