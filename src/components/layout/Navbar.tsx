import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#0B1D3A]">PRE&amp;CON</span>
          <span className="text-sm text-[#00A896]">Ingeniería</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[#2A3F5F] hover:text-[#00A896]">Inicio</Link>
          <Link href="/servicios" className="text-sm font-medium text-[#2A3F5F] hover:text-[#00A896]">Servicios</Link>
          <Link href="/proyectos" className="text-sm font-medium text-[#2A3F5F] hover:text-[#00A896]">Proyectos</Link>
          <Link href="/nosotros" className="text-sm font-medium text-[#2A3F5F] hover:text-[#00A896]">Nosotros</Link>
          <Link href="/admin" className="text-sm font-medium text-[#2A3F5F] hover:text-[#00A896]">Admin</Link>
        </nav>
        <Link
          href="/contacto"
          className="rounded-full bg-[#00A896] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1D3A] transition-colors"
        >
          Contacto
        </Link>
      </div>
    </header>
  );
}
