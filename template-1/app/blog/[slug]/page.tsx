import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findArticle, pinnedRouteSlugs, stripLinks, toText } from "@/lib/advisorkhoj";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { ButtonLink, Container, Section } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 21600;

export function generateStaticParams() {
  return pinnedRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticle(slug);
  if (!article) return { title: "Blog" };
  return {
    title: article.title,
    description: toText(article.short_content, 160),
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await findArticle(slug);
  if (!article) notFound();

  const author = `${article.authorFirstName ?? ""} ${article.authorLastName ?? ""}`.trim();
  const html = stripLinks(article.contents);

  return (
    <>
      <PageHero
        meta={[article.amc, formatDate(article.createDate)].filter(Boolean).join(" · ")}
        title={article.h1 || article.title}
      />
      <Section>
        <Container>
          <Prose html={html} />
          {author ? (
            <p style={{ marginTop: 24, color: "var(--muted)", fontSize: 14 }}>
              Written by {author}, published on Advisorkhoj.
            </p>
          ) : null}
          <ButtonLink href="/blog" $variant="navy" style={{ marginTop: 20 }}>
            Back to blog
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
