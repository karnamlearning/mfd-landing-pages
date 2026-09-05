import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServiceCategory, services } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { IconBadge } from "@/components/icons";
import { ButtonLink, Card, Container, Eyebrow, Grid, Lead, Section } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const category = getServiceCategory(service.category);

  return (
    <>
      <PageHero title={service.title} meta={category?.title} />
      <Section>
        <Container>
          <Lead>{service.description}</Lead>
          <Grid style={{ marginTop: 36 }}>
            <Card>
              <Eyebrow>Who it is for</Eyebrow>
              <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.8, color: "var(--muted)" }}>
                {service.whoFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <Eyebrow>How we work</Eyebrow>
              <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.8, color: "var(--muted)" }}>
                {service.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <IconBadge name={service.slug} />
              <Eyebrow style={{ marginTop: 14 }}>Not sure if this is right for you?</Eyebrow>
              <p style={{ margin: "12px 0 18px", color: "var(--muted)", lineHeight: 1.7 }}>
                Speak to us. We will tell you whether this fits your plan, or whether
                your existing arrangements already cover the need.
              </p>
              <ButtonLink href="/contact">Book a consultation</ButtonLink>
            </Card>
          </Grid>
          {service.illustration ? (
            <Card style={{ marginTop: 22 }}>
              <Eyebrow>{service.illustration.title}</Eyebrow>
              <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.8, color: "var(--muted)" }}>
                {service.illustration.lines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {service.illustration.note ? (
                <p style={{ marginTop: 14, color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>
                  {service.illustration.note}
                </p>
              ) : null}
            </Card>
          ) : null}
          <ButtonLink
            href={`/services#${service.category}`}
            $variant="ghost"
            style={{ marginTop: 28 }}
          >
            Back to {category?.title ?? "services"}
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
