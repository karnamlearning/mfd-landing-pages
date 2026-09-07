"use client";

import styled from "styled-components";

/**
 * Renders sanitised HTML from the Advisorkhoj API. Anchors are stripped
 * upstream by `stripLinks`, so nothing here is clickable by design.
 */
const Wrap = styled.div`
  max-width: 74ch;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.75;

  p,
  ul,
  ol,
  table,
  blockquote {
    margin-bottom: 18px;
  }

  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
    margin: 32px 0 12px;
    line-height: 1.25;
  }

  h2 {
    font-size: 28px;
  }

  h3 {
    font-size: 22px;
  }

  h4 {
    font-size: 18px;
  }

  ul,
  ol {
    padding-left: 22px;
  }

  li {
    margin-bottom: 8px;
  }

  img {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    border-radius: var(--radius);
    margin: 8px 0 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    display: block;
    overflow-x: auto;
  }

  th,
  td {
    border: 1px solid var(--line);
    padding: 10px 12px;
    text-align: left;
  }

  th {
    background: var(--surface);
    font-weight: 650;
  }

  blockquote {
    padding-left: 18px;
    border-left: 3px solid var(--accent);
    color: var(--muted);
  }

  b,
  strong {
    font-weight: 700;
  }
`;

export function Prose({ html }: { html: string }) {
  return <Wrap dangerouslySetInnerHTML={{ __html: html }} />;
}
