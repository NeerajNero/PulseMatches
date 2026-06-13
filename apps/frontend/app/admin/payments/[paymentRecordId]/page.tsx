import { AdminPaymentDetailView } from "@/components/custom/admin/admin-payment-detail-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

interface AdminPaymentDetailPageProps {
  params: { paymentRecordId: string };
}

export default function AdminPaymentDetailPage({ params }: Readonly<AdminPaymentDetailPageProps>) {
  return (
    <AdminShell title="Payment diagnostics" subtitle="Read-only support detail with sanitized provider event summaries.">
      <AdminPaymentDetailView paymentRecordId={params.paymentRecordId} />
    </AdminShell>
  );
}
