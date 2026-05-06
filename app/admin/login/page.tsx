import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./_form";

export const metadata = { title: "Sign in — IC IITP Admin" };

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/admin");

  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0 }}>
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#f2faf5" }}
    >
      {/* Logo / wordmark */}
      <div className="mb-8 text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 font-black text-white text-xl"
          style={{ backgroundColor: "#3a5214" }}
          aria-hidden="true"
        >
          IC
        </div>
        <h1 className="text-2xl font-black" style={{ color: "#3a5214" }}>
          IC IITP Staff Portal
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5a6644" }}>
          Incubation Centre, IIT Patna
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#e8f0e0] p-8">
        <h2 className="text-lg font-bold mb-6" style={{ color: "#1c2e06" }}>
          Sign in to your account
        </h2>
        <LoginForm />
      </div>

      <p className="mt-6 text-xs text-center" style={{ color: "#7a8e6a" }}>
        This portal is for IC IITP staff only.
        <br />
        Contact your administrator if you need access.
      </p>
    </div>
      </body>
    </html>
  );
}
