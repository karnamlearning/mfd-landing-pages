import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LegalDoc } from "@/components/LegalDoc";
import { Container, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const arns = site.registrations
  .filter((item) => item.label.startsWith("AMFI"))
  .map((item) => item.value)
  .join(" and ");

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" />
      <Section>
        <Container>
          <LegalDoc>
            <p>
              This website is an information service of {site.legalName}, an AMFI-registered
              mutual fund distributor ({arns}). Nothing here is an offer, solicitation, or
              guarantee of returns.
            </p>

            <h2>Calculators and illustrations</h2>
            <p>
              Calculators use assumed constant rates and are not predictions. Figures are
              educational illustrations; actual returns depend on market movements, scheme
              expenses, and the timing of your investments.
            </p>

            <h2>Scheme information</h2>
            <p>
              Scheme information belongs to the respective asset management companies. Always
              read the scheme information document and key information memorandum before
              investing. Mutual fund investments are subject to market risks; past performance
              is not indicative of future returns.
            </p>

            <h2>Our role</h2>
            <p>
              We distribute mutual funds and are paid trail commission by the fund houses, as
              disclosed on this website. We are not a SEBI-registered investment adviser and do
              not provide personalised investment advice under the SEBI (Investment Advisers)
              Regulations.
            </p>

            <h2>Grievances</h2>
            <p>
              Grievances may be raised with us first at {site.email} or {site.phone}, and then
              through AMFI, SEBI SCORES, and SMART ODR as applicable.
            </p>
          </LegalDoc>
        </Container>
      </Section>
    </>
  );
}
