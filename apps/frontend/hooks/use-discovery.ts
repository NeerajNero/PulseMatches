"use client";

import { DiscoveryControllerFindTournamentsStatusEnum } from "@matchflow/client-sdk";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { DISCOVERY_QUERY_KEYS } from "@/utils/query-constants";

export interface TournamentFilters {
  city?: string;
  sport?: string;
  status?: DiscoveryControllerFindTournamentsStatusEnum;
  upcomingOnly?: boolean;
  startsFrom?: string;
  startsTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useSports() {
  return useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.SPORTS,
    queryFn: async () => {
      const response = await apiClient.discovery.discoveryControllerFindSports();
      return response.data ?? [];
    }
  });
}

export function useCities() {
  return useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.CITIES,
    queryFn: async () => {
      const response = await apiClient.discovery.discoveryControllerFindCities();
      return response.data ?? [];
    }
  });
}

export function useTournaments(filters: TournamentFilters) {
  return useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENTS(filters),
    queryFn: async () => {
      const response = await apiClient.discovery.discoveryControllerFindTournaments({
        city: filters.city || undefined,
        sport: filters.sport || undefined,
        status: filters.status,
        upcomingOnly: filters.upcomingOnly,
        startsFrom: filters.startsFrom,
        startsTo: filters.startsTo,
        search: filters.search || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 12
      });
      return response.data;
    }
  });
}

export function useTournamentDetail(slugOrId: string) {
  return useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(slugOrId),
    queryFn: async () => {
      const response = await apiClient.discovery.discoveryControllerFindTournamentDetail({ slugOrId });
      return response.data;
    },
    enabled: Boolean(slugOrId)
  });
}

export function usePublicTournamentFixtures(slugOrId: string) {
  return useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_FIXTURES(slugOrId),
    queryFn: async () => {
      const response = await apiClient.discovery.discoveryControllerFindTournamentFixtures({ slugOrId });
      return response.data ?? [];
    },
    enabled: Boolean(slugOrId)
  });
}
