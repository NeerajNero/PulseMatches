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
import { apiClient, getApiBaseUrl } from "@/lib/apis/api";
import { getAccessToken } from "@/lib/auth-token-store";
import { ADMIN_QUERY_KEYS } from "@/utils/query-constants";

export interface AdminReportDateFilters {
  from?: string;
  to?: string;
}

export interface AdminReportSummary {
  usersByRole: Array<{ key: string; count: number }>;
  organizersByVerificationStatus: Array<{ key: string; count: number }>;
  tournamentsByStatus: Array<{ key: string; count: number }>;
  registrationsByStatus: Array<{ key: string; count: number }>;
  paymentsByProviderStatus: Array<{ provider: string; status: string; count: number }>;
  totalPaidAmount: number;
  totalRefundedAmount: number;
  notificationsByStatus: Array<{ key: string; count: number }>;
  reconciliationByStatus: Array<{ key: string; count: number }>;
}

export interface AdminOperationsStatus {
  status: "ok" | "warning" | "critical";
  serviceName: string;
  appVersion: string;
  checkedAt: string;
  dependencies: Array<{ name: string; status: "ok" | "warning" | "critical" }>;
  paymentProvider: string;
  notificationProvider: string;
  exportMaxRows: number;
  pendingNotifications: number;
  failedNotifications: number;
  staleProcessingNotifications: number;
  stalePaymentIntents: number;
  failedPaymentIntents: number;
  failedPaymentEvents: number;
  latestReconciliationRun: {
    id: string | null;
    provider: string | null;
    status: string | null;
    startedAt: string | null;
    completedAt: string | null;
  };
  thresholds: {
    staleNotificationMinutes: number;
    stalePaymentIntentMinutes: number;
    failedNotificationAlertThreshold: number;
    failedPaymentAlertThreshold: number;
  };
}

interface AdminReportSummaryApi {
  users_by_role: Array<{ key: string; count: number }>;
  organizers_by_verification_status: Array<{ key: string; count: number }>;
  tournaments_by_status: Array<{ key: string; count: number }>;
  registrations_by_status: Array<{ key: string; count: number }>;
  payments_by_provider_status: Array<{ provider: string; status: string; count: number }>;
  total_paid_amount: number;
  total_refunded_amount: number;
  notifications_by_status: Array<{ key: string; count: number }>;
  reconciliation_by_status: Array<{ key: string; count: number }>;
}

interface AdminOperationsStatusApi {
  status: "ok" | "warning" | "critical";
  service_name: string;
  app_version: string;
  checked_at: string;
  dependencies: Array<{ name: string; status: "ok" | "warning" | "critical" }>;
  payment_provider: string;
  notification_provider: string;
  export_max_rows: number;
  pending_notifications: number;
  failed_notifications: number;
  stale_processing_notifications: number;
  stale_payment_intents: number;
  failed_payment_intents: number;
  failed_payment_events: number;
  latest_reconciliation_run: {
    id: string | null;
    provider: string | null;
    status: string | null;
    started_at: string | null;
    completed_at: string | null;
  };
  thresholds: {
    stale_notification_minutes: number;
    stale_payment_intent_minutes: number;
    failed_notification_alert_threshold: number;
    failed_payment_alert_threshold: number;
  };
}

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

export function useAdminReportSummary(filters: AdminReportDateFilters) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.REPORT_SUMMARY(filters),
    queryFn: async () => {
      const summary = await getAuthenticatedJson<AdminReportSummaryApi>("/admin/reports/summary", filters);
      return toAdminReportSummary(summary);
    },
    retry: false
  });
}

export function useAdminOperationsStatus() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.OPERATIONS,
    queryFn: async () => {
      const status = await getAuthenticatedJson<AdminOperationsStatusApi>("/admin/operations/status", {});
      return toAdminOperationsStatus(status);
    },
    retry: false
  });
}

function toAdminReportSummary(summary: AdminReportSummaryApi): AdminReportSummary {
  return {
    usersByRole: summary.users_by_role,
    organizersByVerificationStatus: summary.organizers_by_verification_status,
    tournamentsByStatus: summary.tournaments_by_status,
    registrationsByStatus: summary.registrations_by_status,
    paymentsByProviderStatus: summary.payments_by_provider_status,
    totalPaidAmount: summary.total_paid_amount,
    totalRefundedAmount: summary.total_refunded_amount,
    notificationsByStatus: summary.notifications_by_status,
    reconciliationByStatus: summary.reconciliation_by_status
  };
}

function toAdminOperationsStatus(status: AdminOperationsStatusApi): AdminOperationsStatus {
  return {
    status: status.status,
    serviceName: status.service_name,
    appVersion: status.app_version,
    checkedAt: status.checked_at,
    dependencies: status.dependencies,
    paymentProvider: status.payment_provider,
    notificationProvider: status.notification_provider,
    exportMaxRows: status.export_max_rows,
    pendingNotifications: status.pending_notifications,
    failedNotifications: status.failed_notifications,
    staleProcessingNotifications: status.stale_processing_notifications,
    stalePaymentIntents: status.stale_payment_intents,
    failedPaymentIntents: status.failed_payment_intents,
    failedPaymentEvents: status.failed_payment_events,
    latestReconciliationRun: {
      id: status.latest_reconciliation_run.id,
      provider: status.latest_reconciliation_run.provider,
      status: status.latest_reconciliation_run.status,
      startedAt: status.latest_reconciliation_run.started_at,
      completedAt: status.latest_reconciliation_run.completed_at
    },
    thresholds: {
      staleNotificationMinutes: status.thresholds.stale_notification_minutes,
      stalePaymentIntentMinutes: status.thresholds.stale_payment_intent_minutes,
      failedNotificationAlertThreshold: status.thresholds.failed_notification_alert_threshold,
      failedPaymentAlertThreshold: status.thresholds.failed_payment_alert_threshold
    }
  };
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

async function getAuthenticatedJson<TData>(path: string, params: { from?: string; to?: string }) {
  const url = new URL(path, getApiBaseUrl());
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${getAccessToken() ?? ""}`
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const body = await response.json() as { data: TData };
  return body.data;
}
