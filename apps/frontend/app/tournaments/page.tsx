import type { Metadata } from "next";
import { TournamentCollectionView } from "@/components/custom/tournaments/tournament-collection-view";

export const metadata: Metadata = {
  title: "Tournaments | MatchFlow Arena",
  description: "Browse public sports tournaments by city, sport, date, and keyword."
};

export default function TournamentsPage() {
  return (
    <TournamentCollectionView
      eyebrow="Public discovery"
      title="Tournaments"
      description="Browse published public tournaments by sport, city, schedule, and keyword."
    />
  );
}
