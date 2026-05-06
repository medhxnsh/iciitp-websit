"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1c2e06" }}
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-shadow"
          style={{
            border: "1.5px solid #d4e6c4",
            backgroundColor: "#fafff6",
            color: "#1c2e06",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 0 3px #3a521420")
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          placeholder="you@iitp.ac.in"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1c2e06" }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-shadow"
          style={{
            border: "1.5px solid #d4e6c4",
            backgroundColor: "#fafff6",
            color: "#1c2e06",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 0 3px #3a521420")
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p
          className="text-sm rounded-lg px-3.5 py-2.5"
          style={{ backgroundColor: "#fef2f2", color: "#991b1b" }}
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: "#3a5214" }}
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
