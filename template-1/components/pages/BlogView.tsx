"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import { PageHero } from "@/components/PageHero";
import { Container, Eyebrow, Section } from "@/components/ui";

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  amc: string;
  image: string;
};

const Featured = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  overflow: hidden;
  margin-top: 32px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface-raised);
  box-shadow: var(--shadow);
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Shot = styled.div`
  position: relative;
  min-height: 330px;
  background: var(--surface);

  @media (max-width: 860px) {
    min-height: 220px;
  }
`;

const FeaturedBody = styled.div`
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-family: var(--font-sans);
    font-size: clamp(24px, 2.4vw, 32px);
    line-height: 1.22;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }

  p {
    color: var(--muted);
    line-height: 1.7;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 18px;
    font-size: 13px;
    font-weight: 700;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 22px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
  }
`;

const CardShot = styled.div`
  position: relative;
  height: 170px;
  background: var(--surface);
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 24px;
  flex: 1;

  h3 {
    font-family: var(--font-sans);
    font-size: 20px;
    line-height: 1.32;
    font-weight: 650;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
    font-size: 15px;
  }

  span {
    margin-top: auto;
    padding-top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
  }
`;

const Note = styled.p`
  margin-top: 32px;
  color: var(--muted);
  font-size: 14px;
`;

export function BlogView({ posts }: { posts: PostCard[] }) {
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero title="Blog" />
      <Section>
        <Container>
          {lead ? (
            <Featured href={`/blog/${lead.slug}`}>
              <Shot>
                {lead.image ? (
                  <Image
                    src={lead.image}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : null}
              </Shot>
              <FeaturedBody>
                <Eyebrow>
                  {lead.amc ? `${lead.amc} · ` : ""}
                  {lead.date}
                </Eyebrow>
                <h2>{lead.title}</h2>
                <p>{lead.excerpt}</p>
                <span>
                  Read the note <FiArrowRight />
                </span>
              </FeaturedBody>
            </Featured>
          ) : null}

          <Grid>
            {rest.map((post) => (
              <Card href={`/blog/${post.slug}`} key={post.slug}>
                <CardShot>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 620px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                </CardShot>
                <CardBody>
                  <Eyebrow>
                    {post.amc ? `${post.amc} · ` : ""}
                    {post.date}
                  </Eyebrow>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span>
                    Read the note <FiArrowRight />
                  </span>
                </CardBody>
              </Card>
            ))}
          </Grid>

          {posts.length === 0 ? (
            <Note>The article feed is unavailable right now. Please try again shortly.</Note>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
