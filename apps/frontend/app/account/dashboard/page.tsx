import type { Metadata } from "next";
import { AccountDashboardView } from "@/components/custom/account/account-dashboard-view";

export const metadata: Metadata = {
  title: "Player dashboard | MatchFlow Arena",
  description: "Track registrations, payments, and published results."
};

export default function AccountDashboardPage() {
  return <AccountDashboardView />;
}
