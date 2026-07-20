import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Área da família | Ágatha 2 aninhos",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
