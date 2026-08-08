import type { Metadata } from "next";
import { companyInfo } from "@/lib/company-content";

export const metadata: Metadata = {
  title: `Nosotros — ${companyInfo.legalName}`,
  description:
    "Conoce a KATEMI E.I.R.L.: ingeniería, construcción e instalaciones con foco en calidad y seguridad.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
