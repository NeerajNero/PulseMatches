"use client";

import type {
  AdminControllerListAuditEventsRequest,
  AdminControllerListNotificationsRequest,
  AdminControllerListOrganizersRequest,
  AdminControllerListPaymentsRequest,
  AdminControllerListReconciliationRunsRequest,
  AdminControllerListRegistrationsRequest,
  AdminControllerListTournamentsRequest,
  AdminControllerListUsersRequest,
  RejectOrganizerVerificationRequestDto,
  SkipNotificationRequestDto
} from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { ADMIN_QUERY_KEYS } from "@/utils/query-constants";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.DASHBOARD,
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerGetDashboard();
      return response.data;
    },
    retry: false
  });
}

export function useAdminUsers(filters: AdminControllerListUsersRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.USERS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListUsers(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminOrganizers(filters: AdminControllerListOrganizersRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.ORGANIZERS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListOrganizers(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminOrganizerDetail(organizerId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.ORGANIZER_DETAIL(organizerId),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerFindOrganizerDetail({ organizerId });
      return response.data;
    },
    enabled: Boolean(organizerId),
    retry: false
  });
}

export function useVerifyOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizerId: string) => {
      const response = await apiClient.admin.adminControllerVerifyOrganizer({ organizerId });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  });
}

export function useRejectOrganizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { organizerId: string; body: RejectOrganizerVerificationRequestDto }) => {
      const response = await apiClient.admin.adminControllerRejectOrganizer({
        organizerId: input.organizerId,
        rejectOrganizerVerificationRequestDto: input.body
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  });
}

export function useResetOrganizerVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizerId: string) => {
      const response = await apiClient.admin.adminControllerResetOrganizerVerification({ organizerId });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  });
}

export function useAdminTournaments(filters: AdminControllerListTournamentsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.TOURNAMENTS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListTournaments(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminRegistrations(filters: AdminControllerListRegistrationsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.REGISTRATIONS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListRegistrations(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminPayments(filters: AdminControllerListPaymentsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.PAYMENTS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListPayments(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminPaymentDetail(paymentRecordId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.PAYMENT_DETAIL(paymentRecordId),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerFindPaymentDetail({ paymentRecordId });
      return response.data;
    },
    enabled: Boolean(paymentRecordId),
    retry: false
  });
}

export function useAdminNotifications(filters: AdminControllerListNotificationsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.NOTIFICATIONS(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListNotifications(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useRetryNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.admin.adminControllerRetryNotification({ notificationId });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  });
}

export function useSkipNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { notificationId: string; body: SkipNotificationRequestDto }) => {
      const response = await apiClient.admin.adminControllerSkipNotification({
        notificationId: input.notificationId,
        skipNotificationRequestDto: input.body
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  });
}

export function useAdminReconciliationRuns(filters: AdminControllerListReconciliationRunsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.RECONCILIATION(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListReconciliationRuns(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

export function useAdminAuditEvents(filters: AdminControllerListAuditEventsRequest) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.AUDIT(filters),
    queryFn: async () => {
      const response = await apiClient.admin.adminControllerListAuditEvents(cleanFilters(filters));
      return response.data;
    },
    retry: false
  });
}

function cleanFilters<TFilter extends object>(filters: TFilter): TFilter {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  ) as TFilter;
}
