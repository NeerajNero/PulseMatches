import type { Metadata } from "next";
import { TournamentCollectionView } from "@/components/custom/tournaments/tournament-collection-view";

export const metadata: Metadata = {
  title: "Sport tournaments | MatchFlow Arena",
  description: "Browse public tournaments for a selected sport."
};

export default function SportTournamentsPage({ params }: Readonly<{ params: { sport: string } }>) {
  const sportName = formatSlug(params.sport);

  return (
    <TournamentCollectionView
      eyebrow="Sport browsing"
      title={`${sportName} tournaments`}
      description={`Explore published public tournaments listed for ${sportName.toLowerCase()}.`}
      fixedSport={params.sport}
      showSportFilter={false}
    />
  );
}

function formatSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

