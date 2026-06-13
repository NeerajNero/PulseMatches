import {
  AdminApi,
  AuthApi,
  Configuration,
  DiscoveryApi,
  HealthApi,
  OrganizerApi,
  OrganizerFixturesApi,
  OrganizerRostersApi,
  OrganizerTournamentsApi,
  PaymentsApi,
  RegistrationsApi
} from "@matchflow/client-sdk";
import { getAccessToken } from "@/lib/auth-token-store";
import { sdkCustomFetch } from "./sdk-custom-fetch";

export interface ApiClientConfig {
  baseUrl: string;
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3010";
}

export function createApiConfiguration(config: Partial<ApiClientConfig> = {}) {
  return new Configuration({
    basePath: config.baseUrl ?? getApiBaseUrl(),
    credentials: "include",
    fetchApi: sdkCustomFetch,
    accessToken: () => getAccessToken() ?? ""
  });
}

export const apiConfiguration = createApiConfiguration();

export const apiClient = {
  admin: new AdminApi(apiConfiguration),
  auth: new AuthApi(apiConfiguration),
  discovery: new DiscoveryApi(apiConfiguration),
  organizer: new OrganizerApi(apiConfiguration),
  organizerFixtures: new OrganizerFixturesApi(apiConfiguration),
  organizerRosters: new OrganizerRostersApi(apiConfiguration),
  organizerTournaments: new OrganizerTournamentsApi(apiConfiguration),
  payments: new PaymentsApi(apiConfiguration),
  registrations: new RegistrationsApi(apiConfiguration),
  health: new HealthApi(apiConfiguration)
};
