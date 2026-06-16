import type { Metadata } from "next";
import { ScoringFixtureView } from "@/components/custom/scoring/scoring-fixture-view";

export const metadata: Metadata = {
  title: "Fixture Scoring | MatchFlow Arena"
};

export default function ScoringFixturePage({ 
  params, 
  searchParams 
}: { 
  params: { fixtureSetId: string }; 
  searchParams: { tournamentId?: string };
}) {
  return (
    <ScoringFixtureView 
      fixtureSetId={params.fixtureSetId} 
      tournamentId={searchParams.tournamentId ?? ""} 
    />
  );
}
