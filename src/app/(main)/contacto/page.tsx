import type { Metadata } from "next";
import ContactForm, { type ContactContent } from "./ContactForm";
import { getLandingTemplate } from "@/lib/content";
import { companyInfo } from "@/lib/company-content";

export const metadata: Metadata = {
  title: `Contacto — ${companyInfo.legalName}`,
  description: "Escríbenos y evaluamos tu proyecto.",
};

export const revalidate = 60;

export default async function ContactoPage() {
  let content: Partial<ContactContent> | undefined;

  try {
    const template = await getLandingTemplate();
    content = {
      contactInfoTitle: template.contactInfoTitle,
      contactInfoDescription: template.contactInfoDescription,
      contactPhone: template.contactPhone,
      contactEmail: template.contactEmail,
      contactAddress: template.contactAddress,
      contactHours: template.contactHours,
    };
  } catch (error) {
    console.error("Error cargando el contenido de contacto:", error);
  }

  return <ContactForm content={content} />;
}
