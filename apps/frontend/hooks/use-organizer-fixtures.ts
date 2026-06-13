"use client";

import type {
  GenerateFixtureSetRequestDto,
  UpdateMatchScoreRequestDto,
  UpdateMatchScheduleRequestDto
} from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { DISCOVERY_QUERY_KEYS, ORGANIZER_TOURNAMENT_QUERY_KEYS } from "@/utils/query-constants";

function fixtureInvalidations(id: string) {
  return [
    ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURES(id),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id)
  ];
}

function fixtureSetInvalidations(id: string, fixtureSetId: string) {
  return [
    ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURES(id),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE(id, fixtureSetId),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE_RESULTS(id, fixtureSetId),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id)
  ];
}

export function useOrganizerFixtures(id: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURES(id),
    queryFn: async () => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerFindFixtureSets({ id });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useOrganizerFixtureSet(id: string, fixtureSetId: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE(id, fixtureSetId),
    queryFn: async () => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerFindFixtureSet({ id, fixtureSetId });
      return response.data;
    },
    enabled: enabled && Boolean(id) && Boolean(fixtureSetId),
    retry: false
  });
}

export function useOrganizerFixtureResults(id: string, fixtureSetId: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE_RESULTS(id, fixtureSetId),
    queryFn: async () => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerFindFixtureResults({ id, fixtureSetId });
      return response.data;
    },
    enabled: enabled && Boolean(id) && Boolean(fixtureSetId),
    retry: false
  });
}

export function useGenerateFixtureSet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { categoryId: string; data: GenerateFixtureSetRequestDto }) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerGenerateFixtureSet({
        id,
        categoryId: input.categoryId,
        generateFixtureSetRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async (fixtureSet) => {
      await Promise.all([
        ...fixtureInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        fixtureSet
          ? queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE(id, fixtureSet.id) })
          : Promise.resolve()
      ]);
    }
  });
}

export function useUpdateMatchSchedule(id: string, fixtureSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { matchId: string; data: UpdateMatchScheduleRequestDto }) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerUpdateMatchSchedule({
        id,
        fixtureSetId,
        matchId: input.matchId,
        updateMatchScheduleRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...fixtureSetInvalidations(id, fixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      ]);
    }
  });
}

export function useUpdateMatchScore(id: string, fixtureSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { matchId: string; data: UpdateMatchScoreRequestDto }) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerUpdateMatchScore({
        id,
        fixtureSetId,
        matchId: input.matchId,
        updateMatchScoreRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all(fixtureSetInvalidations(id, fixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    }
  });
}

export function useCompleteMatch(id: string, fixtureSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { matchId: string; data: UpdateMatchScoreRequestDto }) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerCompleteMatch({
        id,
        fixtureSetId,
        matchId: input.matchId,
        updateMatchScoreRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all(fixtureSetInvalidations(id, fixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    }
  });
}

export function useReopenMatch(id: string, fixtureSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerReopenMatch({ id, fixtureSetId, matchId });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all(fixtureSetInvalidations(id, fixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    }
  });
}

export function usePublishFixtureResults(id: string, publicSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixtureSetId: string) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerPublishFixtureResults({ id, fixtureSetId });
      return response.data;
    },
    onSuccess: async (fixtureSet, fixtureSetId) => {
      const resolvedFixtureSetId = fixtureSet?.id ?? fixtureSetId;
      await Promise.all([
        ...fixtureSetInvalidations(id, resolvedFixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        publicSlug
          ? queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_FIXTURES(publicSlug) })
          : Promise.resolve()
      ]);
    }
  });
}

export function useUnpublishFixtureResults(id: string, publicSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixtureSetId: string) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerUnpublishFixtureResults({ id, fixtureSetId });
      return response.data;
    },
    onSuccess: async (fixtureSet, fixtureSetId) => {
      const resolvedFixtureSetId = fixtureSet?.id ?? fixtureSetId;
      await Promise.all([
        ...fixtureSetInvalidations(id, resolvedFixtureSetId).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        publicSlug
          ? queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_FIXTURES(publicSlug) })
          : Promise.resolve()
      ]);
    }
  });
}

export function useArchiveFixtureSet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixtureSetId: string) => {
      const response = await apiClient.organizerFixtures.organizerFixturesControllerArchiveFixtureSet({ id, fixtureSetId });
      return response.data;
    },
    onSuccess: async (fixtureSet, fixtureSetId) => {
      await Promise.all([
        ...fixtureInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE(id, fixtureSet?.id ?? fixtureSetId) }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE_RESULTS(id, fixtureSet?.id ?? fixtureSetId) })
      ]);
    }
  });
}
