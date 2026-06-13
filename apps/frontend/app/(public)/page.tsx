import type { Metadata } from "next";
import { HomePageContent } from "@/components/custom/public/home-page";

export const metadata: Metadata = {
  title: "MatchFlow Arena | Sports tournament discovery",
  description: "Find original sports tournaments by city and sport on MatchFlow Arena."
};

export default function HomePage() {
  return <HomePageContent />;
}
