"use client";

import styled from "styled-components";

/**
 * Body copy for the privacy policy and terms of service. Left-aligned under
 * the page title (the old version centred a narrower column, so the text sat
 * offset from the heading) and capped at a comfortable reading measure.
 */
export const LegalDoc = styled.div`
  max-width: 72ch;
  color: var(--ink);
  font-size: 16.5px;
  line-height: 1.75;

  p,
  ul,
  ol {
    margin-bottom: 18px;
    color: var(--muted);
  }

  h2 {
    font-family: var(--font-display);
    font-size: 22px;
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 32px 0 10px;
    color: var(--ink);
  }

  ul,
  ol {
    padding-left: 22px;
  }

  li {
    margin-bottom: 8px;
  }
`;
