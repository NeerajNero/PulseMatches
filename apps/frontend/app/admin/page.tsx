import { redirect } from "next/navigation";
import { ROUTES } from "@/utils/route";

export default function AdminIndexPage() {
  redirect(ROUTES.ADMIN_DASHBOARD);
}
