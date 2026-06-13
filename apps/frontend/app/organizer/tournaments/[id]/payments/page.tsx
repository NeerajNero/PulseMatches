import { OrganizerPaymentManagementView } from "@/components/custom/organizer/organizer-payment-management-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentPaymentsPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer payments"
      title="Manual payment tracking"
      subtitle="Verify offline registration payments for an owned tournament."
    >
      <OrganizerPaymentManagementView id={params.id} />
    </OrganizerShell>
  );
}
