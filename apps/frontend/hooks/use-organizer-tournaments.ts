"use client";

import type {
  CreateOrganizerTournamentRequestDto,
  CreateTournamentCategoryRequestDto,
  OrganizerTournamentsControllerFindTournamentsStatusEnum,
  UpdateOrganizerTournamentRequestDto,
  UpdateTournamentCategoryRequestDto
} from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import {
  DISCOVERY_QUERY_KEYS,
  ORGANIZER_TOURNAMENT_QUERY_KEYS
} from "@/utils/query-constants";

export interface OrganizerTournamentFilters {
  status?: OrganizerTournamentsControllerFindTournamentsStatusEnum | "";
  sport?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useOrganizerDashboard(enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.DASHBOARD,
    queryFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerGetDashboard();
      return response.data;
    },
    enabled,
    retry: false
  });
}

export function useOrganizerTournaments(filters: OrganizerTournamentFilters, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENTS(filters),
    queryFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerFindTournaments({
        status: filters.status || undefined,
        sport: filters.sport || undefined,
        search: filters.search || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 12
      });
      return response.data;
    },
    enabled,
    retry: false
  });
}

export function useOrganizerTournament(id: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id),
    queryFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerFindTournament({ id });
      return response.data;
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useTournamentCategories(id: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.CATEGORIES(id),
    queryFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerFindCategories({ id });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useCreateOrganizerTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrganizerTournamentRequestDto) => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerCreateTournament({
        createOrganizerTournamentRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.DASHBOARD }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournaments"] })
      ]);
    }
  });
}

export function useUpdateOrganizerTournament(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateOrganizerTournamentRequestDto) => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerUpdateTournament({
        id,
        updateOrganizerTournamentRequestDto: input
      });
      return response.data;
    },
    onSuccess: async (tournament) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournaments"] }),
        tournament
          ? queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(tournament.slug) })
          : Promise.resolve()
      ]);
    }
  });
}

export function usePublishTournament(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerPublishTournament({ id });
      return response.data;
    },
    onSuccess: async (tournament) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.DASHBOARD }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournaments"] }),
        queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENTS({}) }),
        tournament
          ? queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(tournament.slug) })
          : Promise.resolve()
      ]);
    }
  });
}

export function useUnpublishTournament(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerUnpublishTournament({ id });
      return response.data;
    },
    onSuccess: async (tournament) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.DASHBOARD }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournaments"] }),
        tournament
          ? queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(tournament.slug) })
          : Promise.resolve()
      ]);
    }
  });
}

export function useCreateTournamentCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTournamentCategoryRequestDto) => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerCreateCategory({
        id,
        createTournamentCategoryRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.CATEGORIES(id) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) })
      ]);
    }
  });
}

export function useUpdateTournamentCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { categoryId: string; data: UpdateTournamentCategoryRequestDto }) => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerUpdateCategory({
        id,
        categoryId: input.categoryId,
        updateTournamentCategoryRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.CATEGORIES(id) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) })
      ]);
    }
  });
}

export function useDeleteTournamentCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiClient.organizerTournaments.organizerTournamentsControllerDeleteCategory({
        id,
        categoryId
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.CATEGORIES(id) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id) })
      ]);
    }
  });
}
