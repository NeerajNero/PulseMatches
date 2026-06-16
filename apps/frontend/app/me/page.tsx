"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { getRoleLandingRoute } from "@/utils/auth-redirect";
import { ROUTES } from "@/utils/route";

export default function MePage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const roles = useMemo(() => currentUser.data?.roles ?? [], [currentUser.data?.roles]);

  useEffect(() => {
    if (currentUser.isLoading) {
      return;
    }
    if (!currentUser.data) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    router.replace(getRoleLandingRoute(roles));
  }, [currentUser.data, currentUser.isLoading, roles, router]);

  return (
    <main className="dashboard-shell">
      <p className="state-text compact-state">Redirecting.</p>
    </main>
  );
}
