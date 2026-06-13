"use client";

import type { CreateRegistrationRequestDto, VerifyRazorpayPaymentRequestDto } from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { DISCOVERY_QUERY_KEYS, REGISTRATION_QUERY_KEYS } from "@/utils/query-constants";

export function useMyRegistrations(enabled = true) {
  return useQuery({
    queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS,
    queryFn: async () => {
      const response = await apiClient.registrations.registrationsControllerFindMyRegistrations();
      return response.data ?? [];
    },
    enabled,
    retry: false
  });
}

export function useCreateRegistration(slugOrId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRegistrationRequestDto) => {
      const response = await apiClient.registrations.registrationsControllerCreateTournamentRegistration({
        slugOrId,
        createRegistrationRequestDto: input
      });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        queryClient.invalidateQueries({ queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(slugOrId) })
      ]);
    }
  });
}

export function useMyRegistrationPayment(registrationId: string, enabled = true) {
  return useQuery({
    queryKey: REGISTRATION_QUERY_KEYS.PAYMENT(registrationId),
    queryFn: async () => {
      const response = await apiClient.payments.paymentsControllerFindRegistrationPayment({ registrationId });
      return response.data;
    },
    enabled: Boolean(registrationId) && enabled,
    retry: false
  });
}

export function useCreatePaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await apiClient.payments.paymentsControllerCreatePaymentIntent({ registrationId });
      return response.data;
    },
    onSuccess: async (intent) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        intent
          ? queryClient.invalidateQueries({ queryKey: ["registrations"] })
          : Promise.resolve()
      ]);
    }
  });
}

export function useMockCompletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await apiClient.payments.paymentsControllerCompleteMockPayment({
        mockCompletePaymentRequestDto: { paymentIntentId }
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  });
}

export function useVerifyRazorpayPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      registrationId: string;
      payload: VerifyRazorpayPaymentRequestDto;
    }) => {
      const response = await apiClient.payments.paymentsControllerVerifyRazorpayPayment({
        registrationId: input.registrationId,
        verifyRazorpayPaymentRequestDto: input.payload
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  });
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.registrations.registrationsControllerCancelRegistration({ id });
      return response.data;
    },
    onSuccess: async (registration) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEYS.MY_REGISTRATIONS }),
        registration
          ? queryClient.invalidateQueries({
              queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_DETAIL(registration.tournament.slug)
            })
          : Promise.resolve()
      ]);
    }
  });
}

export { getApiErrorMessage };
