"use client";

import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/custom/auth/auth-shell";
import { useLogin } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";

export default function LoginPage() {
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const result = await login.mutateAsync({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? "")
      });
      const roles = result?.user.roles ?? [];
      window.location.assign(roles.includes("ORGANIZER") ? ROUTES.ORGANIZER : ROUTES.ME);
    } catch {
      setError("Unable to log in with those credentials.");
    }
  }

  return (
    <AuthShell title="Log in" subtitle="Access your MatchFlow Arena workspace.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-action form-action" type="submit" disabled={login.isPending}>
          {login.isPending ? "Logging in" : "Log in"}
        </button>
        <p className="form-link">New here? <a href={ROUTES.SIGNUP}>Create an account</a></p>
      </form>
    </AuthShell>
  );
}

