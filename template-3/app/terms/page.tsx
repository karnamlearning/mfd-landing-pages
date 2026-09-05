import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Container, Lead, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" />
      <Section>
        <Container style={{ maxWidth: 760 }}>
          <Lead>
            This website is an information service of {site.legalName}, an AMFI-registered
            mutual fund distributor. Nothing here is an offer, solicitation, or guarantee
            of returns. Calculators use assumed constant rates and are not predictions.
          </Lead>
          <Lead style={{ marginTop: 16 }}>
            Scheme information belongs to the respective AMCs. Always read the offer
            document and key information memorandum. Investments in securities markets are
            subject to market risks.
          </Lead>
          <Lead style={{ marginTop: 16 }}>
            Grievances may be raised with us first, then through AMFI / SEBI SCORES and
            SMART ODR as applicable.
          </Lead>
        </Container>
      </Section>
    </>
  );
}
