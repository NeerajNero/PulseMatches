"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SignupRequestDtoRoleEnum } from "@matchflow/client-sdk";
import { AuthShell } from "@/components/custom/auth/auth-shell";
import { getDefaultSignupRole, useSignup } from "@/hooks/use-auth";
import { getPostAuthRedirectPath } from "@/utils/auth-redirect";
import { ROUTES } from "@/utils/route";

export default function SignupPage() {
  const signup = useSignup();
  const router = useRouter();
  const [role, setRole] = useState(getDefaultSignupRole());
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const result = await signup.mutateAsync({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        displayName: String(form.get("displayName") ?? ""),
        role,
        organizationName: role === SignupRequestDtoRoleEnum.Organizer
          ? String(form.get("organizationName") ?? "")
        : undefined,
        contactPhone: String(form.get("contactPhone") ?? "") || undefined
      });
      const searchParams = new URLSearchParams(window.location.search);
      router.replace(getPostAuthRedirectPath({
        roles: result?.user.roles ?? [],
        searchParams
      }));
    } catch {
      setError("Unable to create that account.");
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Join as a player or organizer.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Display name</span>
          <input name="displayName" type="text" autoComplete="name" required minLength={2} />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="new-password" required minLength={8} />
        </label>
        <label>
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value as SignupRequestDtoRoleEnum)}>
            <option value={SignupRequestDtoRoleEnum.Player}>Player</option>
            <option value={SignupRequestDtoRoleEnum.Organizer}>Organizer</option>
          </select>
        </label>
        {role === SignupRequestDtoRoleEnum.Organizer ? (
          <>
            <label>
              <span>Organization name</span>
              <input name="organizationName" type="text" required minLength={2} />
            </label>
            <label>
              <span>Contact phone</span>
              <input name="contactPhone" type="tel" />
            </label>
          </>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-action form-action" type="submit" disabled={signup.isPending}>
          {signup.isPending ? "Creating account" : "Create account"}
        </button>
        <p className="form-link">Already registered? <a href={ROUTES.LOGIN}>Log in</a></p>
      </form>
    </AuthShell>
  );
}
