'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';
import type Lenis from 'lenis';
import { useLenis } from '@/components/providers/LenisProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 350;

function scrollToTop(lenis: Lenis | null, smooth: boolean) {
  if (lenis) {
    lenis.scrollTo(0, smooth ? { duration: 1.2 } : { immediate: true });
    return;
  }

  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
}

export default function ScrollToTop() {
  const pathname = usePathname();
  const { lenisRef } = useLenis();
  const [visible, setVisible] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) {
      return;
    }

    scrollToTop(lenisRef.current, false);
    prevPathnameRef.current = pathname;
  }, [pathname, lenisRef]);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      type="button"
      size="icon-lg"
      aria-label="Volver arriba"
      onClick={() => scrollToTop(lenisRef.current, true)}
      className={cn(
        'fixed z-40 size-12 rounded-full border-0 bg-[#0B1D3A] text-white shadow-lg shadow-[#0B1D3A]/20 transition-all duration-300 hover:bg-[#00A896] hover:shadow-[#00A896]/30',
        'bottom-24 right-4 sm:bottom-8 sm:right-8',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ChevronUp className="size-5" strokeWidth={2.5} />
    </Button>
  );
}
