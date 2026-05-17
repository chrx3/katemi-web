import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import LenisProvider from '~/components/providers/LenisProvider';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
