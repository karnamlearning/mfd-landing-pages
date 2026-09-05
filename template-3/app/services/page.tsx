import type { Metadata } from "next";
import { services, servicesIntro } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { IconBadge } from "@/components/icons";
import { ButtonLink, CardLink, Container, Eyebrow, Grid, Lead, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Onboarding, scheme selection, SIPs, transactions, portfolio monitoring, goal-based investing, and investor service as an AMFI-registered MFD.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" />
      <Section>
        <Container>
          <Lead style={{ marginBottom: 36 }}>{servicesIntro}</Lead>
          <Grid $cols={2}>
            {services.map((service) => (
              <CardLink href={`/services/${service.slug}`} key={service.slug}>
                <IconBadge name={service.slug} />
                <Eyebrow style={{ marginTop: 14 }}>{service.eyebrow}</Eyebrow>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 32 }}>{service.title}</h2>
                <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.7 }}>
                  {service.summary}
                </p>
              </CardLink>
            ))}
          </Grid>
          <ButtonLink href="/calculators" $variant="navy" style={{ marginTop: 28 }}>
            Explore calculators
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
