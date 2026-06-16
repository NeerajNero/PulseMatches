import { ROUTES } from "@/utils/route";

const SAFE_REDIRECT_KEYS = ["redirect", "next", "callbackUrl", "returnTo", "redirectTo"] as const;

export function getRoleLandingRoute(roles: ReadonlyArray<string>) {
  if (roles.includes("ADMIN")) {
    return ROUTES.ADMIN_DASHBOARD;
  }
  if (roles.includes("ORGANIZER")) {
    return ROUTES.ORGANIZER_DASHBOARD;
  }
  return ROUTES.ACCOUNT_DASHBOARD;
}

export function getSafeRedirectPath(searchParams: Pick<URLSearchParams, "get">) {
  for (const key of SAFE_REDIRECT_KEYS) {
    const value = searchParams.get(key);
    const safe = sanitizeInternalPath(value);
    if (safe) {
      return safe;
    }
  }

  return null;
}

export function getPostAuthRedirectPath({
  roles,
  searchParams
}: Readonly<{
  roles: ReadonlyArray<string>;
  searchParams: Pick<URLSearchParams, "get">;
}>) {
  return getSafeRedirectPath(searchParams) ?? getRoleLandingRoute(roles);
}

function sanitizeInternalPath(value: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  if (!trimmed.startsWith("/")) {
    return null;
  }
  if (trimmed.startsWith("//")) {
    return null;
  }
  if (trimmed.includes("://")) {
    return null;
  }
  return trimmed;
}
