"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Every client-side navigation starts at the top of the new page. Next.js only
 * scrolls the first element of the new segment into view, which with a fixed
 * header and a long page can leave the reader partway down. Hash links
 * (`/services#insurance`, `/calculators#sip-return`) are left alone so they
 * still land on their target.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
