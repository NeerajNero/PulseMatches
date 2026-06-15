export function formatAdminLabel(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatAdminDate(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatAdminMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount / 100);
}

export function getAdminStatusTone(status?: string | null) {
  if (status === "paid" || status === "published" || status === "sent" || status === "completed" || status === "succeeded") {
    return "status-pill-ready";
  }
  if (status === "failed" || status === "rejected" || status === "cancelled" || status === "blocked" || status === "critical") {
    return "status-pill-closed";
  }
  return "status-pill-planned";
}
