'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  y?: number;     // px to translate on enter
  as?: 'div' | 'section';
}

/**
 * Lightweight scroll-reveal wrapper.
 * No extra dependencies (no framer-motion needed) — just IntersectionObserver + CSS transition.
 * Wrap any section/block with <Reveal> ... </Reveal> to get a smooth fade + rise-in animation
 * the first time it enters the viewport.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who prefer reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`reveal-el ${visible ? 'reveal-el-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        // fallback inline vars in case global CSS hasn't loaded yet
        ['--reveal-y' as any]: `${y}px`,
      }}
    >
      {children}
    </Tag>
  );
}