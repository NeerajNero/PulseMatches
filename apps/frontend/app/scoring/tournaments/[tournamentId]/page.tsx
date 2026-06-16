import type { Metadata } from "next";
import { ScoringTournamentView } from "@/components/custom/scoring/scoring-tournament-view";

export const metadata: Metadata = {
  title: "Tournament Scoring | MatchFlow Arena"
};

export default function ScoringTournamentPage({ params }: { params: { tournamentId: string } }) {
  return <ScoringTournamentView id={params.tournamentId} />;
}
