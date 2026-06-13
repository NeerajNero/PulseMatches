"use client";

import type {
  CreateParticipantRequestDto,
  CreatePaymentRefundRequestDto,
  CreateTeamMemberRequestDto,
  CreateTeamRequestDto,
  OrganizerRostersControllerFindParticipantsStatusEnum,
  OrganizerRostersControllerFindPaymentsStatusEnum,
  OrganizerRostersControllerFindRegistrationsStatusEnum,
  OrganizerRostersControllerFindTeamsStatusEnum,
  RejectRegistrationRequestDto,
  UpdateRegistrationPaymentRequestDto,
  UpdateParticipantRequestDto,
  UpdateTeamMemberRequestDto,
  UpdateTeamRequestDto
} from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { ORGANIZER_TOURNAMENT_QUERY_KEYS, REGISTRATION_QUERY_KEYS } from "@/utils/query-constants";

export interface OrganizerRosterFilters<TStatus extends string = string> {
  categoryId?: string;
  search?: string;
  status?: TStatus | "";
}

function rosterInvalidations(id: string) {
  return [
    ORGANIZER_TOURNAMENT_QUERY_KEYS.ROSTER_SUMMARY(id),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.TOURNAMENT(id),
    ORGANIZER_TOURNAMENT_QUERY_KEYS.DASHBOARD,
    ["organizer", "tournaments"] as const
  ];
}

export function useOrganizerRosterSummary(id: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.ROSTER_SUMMARY(id),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerGetSummary({ id });
      return response.data;
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useOrganizerRegistrations(
  id: string,
  filters: OrganizerRosterFilters<OrganizerRostersControllerFindRegistrationsStatusEnum>,
  enabled = true
) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.REGISTRATIONS(id, filters),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindRegistrations({
        id,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        status: filters.status || undefined
      });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useOrganizerPayments(
  id: string,
  filters: OrganizerRosterFilters<OrganizerRostersControllerFindPaymentsStatusEnum>,
  enabled = true
) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.PAYMENTS(id, filters),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindPayments({
        id,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        status: filters.status || undefined
      });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useUpdateRegistrationPayment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { registrationId: string; data: UpdateRegistrationPaymentRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerUpdateRegistrationPayment({
        id,
        registrationId: input.registrationId,
        updateRegistrationPaymentRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "payments"] }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "registrations"] })
      ]);
    }
  });
}

export function useOrganizerPaymentDetail(id: string, registrationId: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.PAYMENT_DETAIL(id, registrationId),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindPaymentDetail({
        id,
        registrationId
      });
      return response.data;
    },
    enabled: enabled && Boolean(id) && Boolean(registrationId),
    retry: false
  });
}

export function useCreatePaymentRefund(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { registrationId: string; data: CreatePaymentRefundRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerCreatePaymentRefund({
        id,
        registrationId: input.registrationId,
        createPaymentRefundRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async (_payment, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "payments"] }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.PAYMENT_DETAIL(id, input.registrationId) })
      ]);
    }
  });
}

export function useApproveRegistration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerApproveRegistration({ id, registrationId });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "registrations"] }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "participants"] })
      ]);
    }
  });
}

export function useRejectRegistration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { registrationId: string; data?: RejectRegistrationRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerRejectRegistration({
        id,
        registrationId: input.registrationId,
        rejectRegistrationRequestDto: input.data ?? {}
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "registrations"] })
      ]);
    }
  });
}

export function useCancelOrganizerRegistration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerCancelRegistration({ id, registrationId });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "registrations"] }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "participants"] })
      ]);
    }
  });
}

export function useOrganizerParticipants(
  id: string,
  filters: OrganizerRosterFilters<OrganizerRostersControllerFindParticipantsStatusEnum>,
  enabled = true
) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.PARTICIPANTS(id, filters),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindParticipants({
        id,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        status: filters.status || undefined
      });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useCreateParticipant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateParticipantRequestDto) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerCreateParticipant({
        id,
        createParticipantRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "participants"] })
      ]);
    }
  });
}

export function useUpdateParticipant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { participantId: string; data: UpdateParticipantRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerUpdateParticipant({
        id,
        participantId: input.participantId,
        updateParticipantRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "participants"] })
      ]);
    }
  });
}

export function useDeleteParticipant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: string) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerDeleteParticipant({ id, participantId });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "participants"] })
      ]);
    }
  });
}

export function useOrganizerTeams(
  id: string,
  filters: OrganizerRosterFilters<OrganizerRostersControllerFindTeamsStatusEnum>,
  enabled = true
) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAMS(id, filters),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindTeams({
        id,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        status: filters.status || undefined
      });
      return response.data ?? [];
    },
    enabled: enabled && Boolean(id),
    retry: false
  });
}

export function useOrganizerTeam(id: string, teamId: string, enabled = true) {
  return useQuery({
    queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, teamId),
    queryFn: async () => {
      const response = await apiClient.organizerRosters.organizerRostersControllerFindTeam({ id, teamId });
      return response.data;
    },
    enabled: enabled && Boolean(id) && Boolean(teamId),
    retry: false
  });
}

export function useCreateTeam(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTeamRequestDto) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerCreateTeam({
        id,
        createTeamRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] })
      ]);
    }
  });
}

export function useUpdateTeam(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { teamId: string; data: UpdateTeamRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerUpdateTeam({
        id,
        teamId: input.teamId,
        updateTeamRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async (_team, input) => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, input.teamId) })
      ]);
    }
  });
}

export function useDeleteTeam(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerDeleteTeam({ id, teamId });
      return response.data;
    },
    onSuccess: async (_team, teamId) => {
      await Promise.all([
        ...rosterInvalidations(id).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] }),
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, teamId) })
      ]);
    }
  });
}

export function useCreateTeamMember(id: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTeamMemberRequestDto) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerCreateTeamMember({
        id,
        teamId,
        createTeamMemberRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, teamId) }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] })
      ]);
    }
  });
}

export function useUpdateTeamMember(id: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { memberId: string; data: UpdateTeamMemberRequestDto }) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerUpdateTeamMember({
        id,
        teamId,
        memberId: input.memberId,
        updateTeamMemberRequestDto: input.data
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, teamId) }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] })
      ]);
    }
  });
}

export function useDeleteTeamMember(id: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await apiClient.organizerRosters.organizerRostersControllerDeleteTeamMember({ id, teamId, memberId });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.TEAM(id, teamId) }),
        queryClient.invalidateQueries({ queryKey: ["organizer", "tournament", id, "teams"] })
      ]);
    }
  });
}
