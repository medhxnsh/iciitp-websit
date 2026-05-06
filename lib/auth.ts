import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

export const SESSION_OPTIONS = {
  password:
    process.env.IRON_SESSION_PASSWORD ??
    "dev-only-fallback-password-32-chars!!", // must be ≥32 chars
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
