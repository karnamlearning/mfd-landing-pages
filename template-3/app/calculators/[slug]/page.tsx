import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorMeta, type CalculatorSlug } from "@/lib/calculators";
import { CalculatorPanel } from "@/components/calculators/SipWidget";
import { PageHero } from "@/components/PageHero";
import { ButtonLink, Container, Section } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return calculatorMeta.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = calculatorMeta.find((entry) => entry.slug === slug);
  if (!item) return { title: "Calculator" };
  return { title: item.title, description: item.summary };
}

export default async function CalculatorDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = calculatorMeta.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <>
      <PageHero title={item.title} />
      <Section>
        <Container>
          <CalculatorPanel slug={item.slug as CalculatorSlug} />
          <ButtonLink href="/contact" $variant="navy" style={{ marginTop: 24 }}>
            Discuss this goal with us
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
