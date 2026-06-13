import type { TournamentCategoryDto, TournamentListItemDto } from "@matchflow/client-sdk";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  year: "numeric"
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDateRange(startsAt: string, endsAt: string) {
  const start = formatDate(startsAt);
  const end = formatDate(endsAt);
  return start === end ? start : `${start} to ${end}`;
}

export function formatLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatFee(category: TournamentCategoryDto) {
  if (category.entryFeeAmount === 0) {
    return "Free entry";
  }
  return `${category.entryFeeCurrency} ${category.entryFeeAmount}`;
}

export function getPrimaryMedia(tournament: TournamentListItemDto) {
  return tournament.media.find((media) => media.type === "image") ?? tournament.media[0];
}

export function getVenueSummary(tournament: TournamentListItemDto) {
  return tournament.venue?.name ?? tournament.city.name;
}

