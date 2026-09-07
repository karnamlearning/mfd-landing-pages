import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findMutualFundTopic,
  getMutualFundTitles,
  relatedTopicTitles,
  toHtml,
  toText,
  topicSlug,
} from "@/lib/advisorkhoj";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 21600;

export async function generateStaticParams() {
  const titles = await getMutualFundTitles();
  return titles.map((title) => ({ slug: topicSlug(title) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await findMutualFundTopic(slug);
  if (!topic) return { title: "Mutual Funds" };
  return { title: topic.title, description: toText(topic.content, 160) };
}

export default async function MutualFundTopicPage({ params }: Props) {
  const { slug } = await params;
  const [topic, titles] = await Promise.all([findMutualFundTopic(slug), getMutualFundTitles()]);
  if (!topic) notFound();

  const related = relatedTopicTitles(topic, titles).filter((title) => title !== topic.title);

  return (
    <>
      <PageHero meta="Mutual Funds" title={topic.title} />
      <Section>
        <Container>
          <Prose html={toHtml(topic.content)} />

          {related.length > 0 ? (
            <div style={{ marginTop: 40 }}>
              <Eyebrow>Related topics</Eyebrow>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {related.map((title) => (
                  <li key={title}>
                    <Link
                      href={`/mutual-funds/${topicSlug(title)}`}
                      style={{
                        display: "inline-block",
                        padding: "9px 14px",
                        border: "1px solid var(--line-strong)",
                        borderRadius: "var(--radius-sm, 0)",
                        fontSize: 14,
                        fontWeight: 600,
                        background: "var(--surface-raised)",
                      }}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p style={{ marginTop: 28, color: "var(--muted)", fontSize: 14 }}>
            Source: Advisorkhoj investor education content. Mutual fund investments are subject
            to market risks; read all scheme related documents carefully.
          </p>
          <ButtonLink href="/mutual-funds" $variant="navy" style={{ marginTop: 20 }}>
            All mutual fund topics
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
