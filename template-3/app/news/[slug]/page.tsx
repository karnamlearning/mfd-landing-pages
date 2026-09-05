import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findNews, stripLinks, toText } from "@/lib/advisorkhoj";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { ButtonLink, Container, Section } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 21600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) return { title: "News" };
  return { title: item.title, description: toText(item.small_content, 160) };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) notFound();

  const html = stripLinks(item.full_content || item.contents);

  return (
    <>
      <PageHero meta={`${item.category} · ${formatDate(item.create_date)}`} title={item.title} />
      <Section>
        <Container>
          <Prose html={html} />
          <ButtonLink href="/news" $variant="navy" style={{ marginTop: 28 }}>
            Back to news
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
