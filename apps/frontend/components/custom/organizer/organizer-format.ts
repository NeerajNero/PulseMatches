import type { OrganizerTournamentDto } from "@matchflow/client-sdk";

export function formatDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function toIsoDateTime(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue ? new Date(stringValue).toISOString() : undefined;
}

export function getDefaultDateInput(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(9, 0, 0, 0);
  return formatDateInputValue(date.toISOString());
}

export function getStatusTone(status: string) {
  if (status === "published" || status === "active") {
    return "status-pill-ready";
  }
  return "status-pill-planned";
}

export function getPublicTournamentHref(tournament: OrganizerTournamentDto) {
  return tournament.status === "published" ? `/tournaments/${tournament.slug}` : undefined;
}
