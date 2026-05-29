import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import ScrollToTop from '~/components/layout/ScrollToTop';
import LenisProvider from '~/components/providers/LenisProvider';
import { getLandingTemplateConfig } from '@/lib/pb-admin';
import { landingTemplateDefaults } from '@/lib/template-config';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let template = landingTemplateDefaults;

  try {
    template = await getLandingTemplateConfig();
  } catch (error) {
    console.error('Error loading landing template config for layout:', error);
  }

  return (
    <LenisProvider>
      <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1 w-full min-w-0 overflow-x-hidden">{children}</main>
        <Footer template={template} />
        <ScrollToTop />
      </div>
    </LenisProvider>
  );
}
