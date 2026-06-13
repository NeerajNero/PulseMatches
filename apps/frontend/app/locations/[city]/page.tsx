import type { Metadata } from "next";
import { TournamentCollectionView } from "@/components/custom/tournaments/tournament-collection-view";

export const metadata: Metadata = {
  title: "City tournaments | MatchFlow Arena",
  description: "Browse public tournaments for a selected city."
};

export default function CityTournamentsPage({ params }: Readonly<{ params: { city: string } }>) {
  const cityName = formatSlug(params.city);

  return (
    <TournamentCollectionView
      eyebrow="Location browsing"
      title={`Tournaments in ${cityName}`}
      description={`Explore published public tournaments listed for ${cityName}.`}
      fixedCity={params.city}
      showCityFilter={false}
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

