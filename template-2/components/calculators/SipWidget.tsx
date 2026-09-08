"use client";

import { ButtonLink } from "@/components/ui";

/** Compact home teaser; the calculators live on /tools. */
export function SipWidget() {
  return (
    <div>
      <ButtonLink href="/tools#sip-calculator" $variant="navy">
        Open calculators
      </ButtonLink>
    </div>
  );
}
