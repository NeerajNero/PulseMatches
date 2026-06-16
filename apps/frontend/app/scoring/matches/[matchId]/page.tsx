import type { Metadata } from "next";
import { ScoringMatchView } from "@/components/custom/scoring/scoring-match-view";

export const metadata: Metadata = {
  title: "Match Scoring | MatchFlow Arena"
};

export default function ScoringMatchPage({ 
  params, 
  searchParams 
}: { 
  params: { matchId: string }; 
  searchParams: { fixtureSetId?: string, tournamentId?: string };
}) {
  return (
    <ScoringMatchView 
      matchId={params.matchId} 
      fixtureSetId={searchParams.fixtureSetId ?? ""}
      tournamentId={searchParams.tournamentId ?? ""} 
    />
  );
}
