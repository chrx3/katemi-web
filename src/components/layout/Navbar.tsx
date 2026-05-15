'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Init Lenis smooth scroll
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        lenisRef.current = lenis;

        function raf(time: number) {
          lenis!.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Lenis not available, use native scroll
      }
    };

    initLenis();
    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Close mobile menu
    setMobileOpen(false);

    // If it's a hash link
    if (href.startsWith('/#') || href === '/') {
      e.preventDefault();
      const hash = href.replace('/', '') || '';

      if (lenisRef.current) {
        (lenisRef.current as { scrollTo: (opts: { hash: string; duration: number }) => void }).scrollTo({
          hash: hash || 'body',
          duration: 1.5,
        });
      } else {
        const target = document.querySelector(hash || 'body');
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0B1D3A] group-hover:bg-[#00A896] transition-colors duration-300">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Katemi
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === '/' && pathname === '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      isActive
                        ? 'text-[#00D4FF]'
                        : 'text-[#2A3F5F] hover:text-[#0B1D3A] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00D4FF]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/contacto"
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-[#00A896] text-white text-sm font-semibold hover:bg-[#008f7f] transition-colors duration-200 shadow-sm"
              >
                Cotizar
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-[#0B1D3A]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#0B1D3A]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0B1D3A]/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b">
                <span className="text-lg font-bold tracking-tight">Katemi</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#0B1D3A]" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          scrollToSection(e, link.href);
                          setMobileOpen(false);
                        }}
                        className={`flex items-center px-6 py-4 min-h-[56px] text-base font-medium border-b border-gray-100 transition-colors ${
                          isActive
                            ? 'text-[#00D4FF] bg-[#00D4FF]/5'
                            : 'text-[#2A3F5F] hover:text-[#0B1D3A] hover:bg-[#F5F5F5]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <div className="p-6 border-t">
                <Link
                  href="/contacto"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-lg bg-[#00A896] text-white font-semibold hover:bg-[#008f7f] transition-colors"
                >
                  Cotizar Ahora
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}