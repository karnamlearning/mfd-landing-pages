"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Every client-side navigation starts at the top of the new page, unless the
 * URL has a hash that matches an element (services sections). Calculator hashes
 * name a tab, not a node, so those land at the top and the tab rail takes over.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));

    const toHash = () => {
      if (!hash) return false;
      const target = document.getElementById(hash);
      if (!target) return false;
      target.scrollIntoView({ behavior: "instant", block: "start" });
      return true;
    };

    if (!toHash()) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    // Service sections paint after this effect; give them a second chance.
    const frame = window.requestAnimationFrame(() => {
      toHash();
    });
    const timer = window.setTimeout(toHash, 160);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
