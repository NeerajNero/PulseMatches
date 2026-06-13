"use client";

import {
  LoginRequestDto,
  SignupRequestDto,
  SignupRequestDtoRoleEnum
} from "@matchflow/client-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apis/api";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/lib/auth-token-store";
import { AUTH_QUERY_KEYS } from "@/utils/query-constants";

function persistAuthResponse(responseData: Awaited<ReturnType<typeof apiClient.auth.authControllerLogin>>["data"]) {
  if (!responseData) {
    return;
  }
  setAuthTokens({
    accessToken: responseData.tokens.accessToken,
    refreshToken: responseData.tokens.refreshToken
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ME,
    queryFn: async () => {
      const response = await apiClient.auth.authControllerMe();
      return response.data;
    },
    enabled: Boolean(getAccessToken()),
    retry: false
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginRequestDto) => {
      const response = await apiClient.auth.authControllerLogin({ loginRequestDto: input });
      persistAuthResponse(response.data);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
    }
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SignupRequestDto) => {
      const response = await apiClient.auth.authControllerSignup({ signupRequestDto: input });
      persistAuthResponse(response.data);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      await apiClient.auth.authControllerLogout({
        logoutRequestDto: {
          refreshToken: refreshToken ?? undefined
        }
      });
      clearAuthTokens();
    },
    onSettled: async () => {
      clearAuthTokens();
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
    }
  });
}

export function getDefaultSignupRole(): SignupRequestDtoRoleEnum {
  return SignupRequestDtoRoleEnum.Player;
}

