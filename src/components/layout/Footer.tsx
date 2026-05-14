import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B1D3A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PRE&amp;CON</h3>
            <p className="text-sm text-gray-400">Ingeniería de proyectos industriales y construcción en Chile.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#00A896]">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/servicios" className="hover:text-white">Ingeniería</Link></li>
              <li><Link href="/servicios" className="hover:text-white">Construcción</Link></li>
              <li><Link href="/servicios" className="hover:text-white">Proyectos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#00A896]">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
              <li><Link href="/proyectos" className="hover:text-white">Proyectos</Link></li>
              <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#00A896]">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Chile</li>
              <li>info@precon.cl</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PRE&CON Ingeniería. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
