"use client";

import { useEffect, useRef } from "react";
import { globalLenis } from "./smooth-scroll-provider";
import { isSectionSnapSuppressed } from "./section-snap-suppression";

interface SectionSnapProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionSnap({ children, className }: SectionSnapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function trySnap() {
      const lenis = globalLenis;
      if (!el || !lenis || isSnapping.current) return;
      if (isSectionSnapSuppressed()) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const topOffset = rect.top;
      const sectionH = el.offsetHeight;
      const isTaller = sectionH > viewportH * 1.1;
      const snapZone = viewportH * 0.38;
      const inSnapZone = topOffset > -snapZone && topOffset < snapZone;

      if (!inSnapZone) return;

      if (isTaller) {
        if (topOffset > viewportH * 0.08) {
          isSnapping.current = true;
          lenis.scrollTo(el, {
            offset: 0,
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => { isSnapping.current = false; },
          });
        }
      } else {
        isSnapping.current = true;
        lenis.scrollTo(el, {
          offset: 0,
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => { isSnapping.current = false; },
        });
      }
    }

    function onLenisScroll({ velocity }: { velocity: number }) {
      if (isSnapping.current) return;
      if (isSectionSnapSuppressed()) return;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (Math.abs(velocity) < 0.08) {
        idleTimer.current = setTimeout(trySnap, 60);
      }
    }

    function bindLenis() {
      const lenis = globalLenis;
      if (!lenis) {
        requestAnimationFrame(bindLenis);
        return;
      }
      lenis.on("scroll", onLenisScroll);
      cleanupRef.current = () => {
        lenis.off("scroll", onLenisScroll);
        if (idleTimer.current) clearTimeout(idleTimer.current);
      };
    }

    requestAnimationFrame(bindLenis);

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
