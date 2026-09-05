import type { Metadata } from "next";
import { calculatorMeta } from "@/lib/calculators";
import { PageHero } from "@/components/PageHero";
import { IconBadge } from "@/components/icons";
import { CardLink, Container, Eyebrow, Grid, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Calculators",
  description:
    "SIP, retirement, education, lumpsum, and crorepati calculators for goal planning.",
};

export default function CalculatorsPage() {
  return (
    <>
      <PageHero title="Calculators" />
      <Section>
        <Container>
          <Grid>
            {calculatorMeta.map((item) => (
              <CardLink href={`/calculators/${item.slug}`} key={item.slug}>
                <IconBadge name={item.slug} set="calculator" />
                <Eyebrow style={{ marginTop: 14 }}>{item.eyebrow}</Eyebrow>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 28 }}>{item.title}</h2>
                <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.65 }}>
                  {item.summary}
                </p>
              </CardLink>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
