import type { Metadata } from "next";
import { TournamentDetailView } from "@/components/custom/tournaments/tournament-detail-view";

export const metadata: Metadata = {
  title: "Tournament details | MatchFlow Arena",
  description: "Review tournament schedule, venue, organizer, and event categories."
};

export default function TournamentDetailPage({ params }: Readonly<{ params: { slug: string } }>) {
  return <TournamentDetailView slug={params.slug} />;
}
