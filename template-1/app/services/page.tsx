import type { Metadata } from "next";
import {
  serviceCategories,
  servicesIntro,
  getServicesByCategory,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ServiceTabs } from "@/components/ServiceTabs";
import { IconBadge } from "@/components/icons";
import {
  ButtonLink,
  CardLink,
  Container,
  Display,
  Eyebrow,
  Grid,
  IconRow,
  Lead,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Mutual funds, insurance, and FD & bond services - selection, execution, monitoring, and ongoing support.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" meta="What we do" />
      <ServiceTabs
        tabs={serviceCategories.map((category) => ({ id: category.id, label: category.title }))}
      />
      <Section>
        <Container>
          <Lead style={{ marginBottom: 48, maxWidth: "62ch" }}>{servicesIntro}</Lead>

          {serviceCategories.map((category) => {
            const items = getServicesByCategory(category.id);
            return (
              <div
                key={category.id}
                id={category.id}
                style={{ marginBottom: 72, scrollMarginTop: 150 }}
              >
                <Eyebrow>{category.eyebrow}</Eyebrow>
                <Display style={{ maxWidth: "14ch", marginTop: 8 }}>{category.title}</Display>
                <Lead style={{ marginTop: 16, marginBottom: 28 }}>{category.summary}</Lead>
                {category.note ? (
                  <p
                    style={{
                      marginBottom: 28,
                      maxWidth: "68ch",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--muted)",
                    }}
                  >
                    {category.note}
                  </p>
                ) : null}
                <Grid $cols={2}>
                  {items.map((service) => (
                    <CardLink href={`/services/${service.slug}`} key={service.slug}>
                      <IconRow>
                        <IconBadge name={service.slug} />
                        <Eyebrow>{service.eyebrow}</Eyebrow>
                      </IconRow>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginTop: 16 }}>
                        {service.title}
                      </h2>
                      <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.7 }}>
                        {service.summary}
                      </p>
                    </CardLink>
                  ))}
                </Grid>
              </div>
            );
          })}

          <ButtonLink href="/contact" $variant="navy" style={{ marginTop: 8 }}>
            Book a consultation
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
