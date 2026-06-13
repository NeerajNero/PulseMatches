"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { getAccessToken } from "@/lib/auth-token-store";
import { AUTH_QUERY_KEYS } from "@/utils/query-constants";

export function useOrganizerProfile() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ORGANIZER_PROFILE,
    queryFn: async () => {
      const response = await apiClient.organizer.organizerControllerGetProfile();
      return response.data;
    },
    enabled: Boolean(getAccessToken()),
    retry: false
  });
}

