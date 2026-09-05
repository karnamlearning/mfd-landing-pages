"use client";

import styled from "styled-components";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import { faqs } from "@/lib/content";
import { Card, Container, Eyebrow, Section } from "@/components/ui";
import { IconBadge } from "@/components/icons";

const groups = [
  { id: "mutual-funds", label: "Mutual funds", items: faqs["mutual-funds"] },
  { id: "nri", label: "NRI corner", items: faqs.nri },
  { id: "planning", label: "Financial planning", items: faqs.planning },
] as const;

const Q = styled.details`
  border-bottom: 1px solid var(--line);
  padding: 16px 0;

  summary {
    cursor: pointer;
    font-weight: 700;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.18s ease;
  }

  &[open] summary svg {
    transform: rotate(180deg);
  }

  p {
    margin-top: 10px;
    color: var(--muted);
    line-height: 1.7;
    padding-right: 28px;
  }
`;

const Block = styled.div`
  scroll-margin-top: 110px;
  margin-bottom: 28px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export type FaqEntry = { question: string; answer: string };

export function FaqList({ items }: { items?: FaqEntry[] }) {
  // Live investor FAQs come from the API as one flat list. The curated,
  // grouped set below is the fallback when that feed is unavailable.
  if (items && items.length > 0) {
    return (
      <Section>
        <Container>
          <Head>
            <IconBadge icon={FiHelpCircle} />
            <Eyebrow style={{ marginBottom: 0 }}>Investor FAQs</Eyebrow>
          </Head>
          <Card>
            {items.map((item) => (
              <Q key={item.question}>
                <summary>
                  {item.question}
                  <FiChevronDown size={18} />
                </summary>
                <p>{item.answer}</p>
              </Q>
            ))}
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        {groups.map((group) => (
          <Block key={group.id} id={group.id}>
            <Head>
              <IconBadge icon={FiHelpCircle} />
              <Eyebrow style={{ marginBottom: 0 }}>{group.label}</Eyebrow>
            </Head>
            <Card>
              {group.items.map((item) => (
                <Q key={item.q}>
                  <summary>
                    {item.q}
                    <FiChevronDown size={18} />
                  </summary>
                  <p>{item.a}</p>
                </Q>
              ))}
            </Card>
          </Block>
        ))}
      </Container>
    </Section>
  );
}
