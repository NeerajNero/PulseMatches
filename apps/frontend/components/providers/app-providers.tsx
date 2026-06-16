"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MobileBottomNav } from "@/components/custom/mobile/mobile-bottom-nav";
import { OfflineBanner } from "@/components/custom/mobile/offline-banner";

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      {children}
      <MobileBottomNav />
    </QueryClientProvider>
  );
}
