import type { Metadata } from "next";
import { ScoringHomeView } from "@/components/custom/scoring/scoring-home-view";

export const metadata: Metadata = {
  title: "Scoring Control Center | MatchFlow Arena",
  description: "Live tournament scoring and match management."
};

export default function ScoringPage() {
  return <ScoringHomeView />;
}
