"use client";

import Link from "next/link";
import styled from "styled-components";
import { footerNav, site } from "@/lib/site";
import { Container } from "@/components/ui";
import { contactIcons, socialIcons } from "@/components/icons";

/*
 * The reference footer: a contact line, an oversized serif wordmark, a row of
 * pill links, and the small print. Cream, not dark - the wordmark carries it.
 */

const Wrap = styled.footer`
  background: var(--surface);
  color: var(--ink);
  padding: 72px 0 32px;
  border-top: 1px solid var(--line);
  overflow: hidden;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--muted);

  a:hover {
    color: var(--ink);
  }
`;

const ContactList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
`;

const IconRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    flex-shrink: 0;
    color: var(--accent-strong);
  }
`;

const Address = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  max-width: 34ch;
  text-align: right;

  @media (max-width: 700px) {
    text-align: left;
  }
`;

const Brand = styled.p`
  font-family: var(--font-display);
  font-size: clamp(72px, 17vw, 240px);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.9;
  text-align: center;
  color: var(--ink);
  margin: 36px 0 32px;
  white-space: nowrap;
`;

const Pills = styled.nav`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Pill = styled(Link)<{ $primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid ${({ $primary }) => ($primary ? "var(--brand-deep)" : "var(--line-strong)")};
  background: ${({ $primary }) => ($primary ? "var(--brand-deep)" : "var(--surface-raised)")};
  color: ${({ $primary }) => ($primary ? "var(--on-brand)" : "var(--ink)")};
  font-size: 13px;
  font-weight: 600;
  transition: 0.18s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "var(--brand)" : "var(--surface-sage)")};
  }
`;

const Fine = styled.p`
  margin: 40px auto 0;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 96ch;
  text-align: center;

  a {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 22px;
  font-size: 13px;
  color: var(--muted);
`;

const Social = styled.div`
  display: flex;
  gap: 8px;

  a {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-strong);
    border-radius: 50%;
    color: var(--ink);
    transition: 0.18s ease;
  }

  a:hover {
    background: var(--brand-deep);
    border-color: var(--brand-deep);
    color: var(--on-brand);
  }
`;

/* Registration numbers come from lib/site.ts so the disclaimer never drifts. */
const amfi = site.registrations.find((item) => item.label.startsWith("AMFI"));
const apmi = site.registrations.find((item) => item.label.startsWith("APMI"));

function describe(item: typeof amfi) {
  if (!item) return "";
  const valid = "validTill" in item && item.validTill ? `, valid till ${item.validTill}` : "";
  return `${item.value}${valid}`;
}

const pills = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Calculators", href: "/calculators" },
  { label: "Blog", href: "/blog" },
  { label: "News", href: "/news" },
  { label: "FAQs", href: "/faqs" },
  ...footerNav.company.filter((item) => ["/disclosures", "/privacy", "/terms"].includes(item.href)),
];

export function Footer() {
  const Phone = contactIcons.phone;
  const Mail = contactIcons.mail;

  return (
    <Wrap>
      <Container>
        <Top>
          <ContactList>
            <IconRow>
              <Mail size={14} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </IconRow>
            <IconRow>
              <Phone size={14} />
              <a href={site.phoneHref}>{site.phone}</a>
            </IconRow>
            <li>{site.hours}</li>
          </ContactList>
          <Address>{site.address.lines.slice(1).join(", ")}</Address>
        </Top>

        <Brand aria-hidden>{site.shortName}</Brand>

        <Pills aria-label="Footer">
          {pills.map((item) => (
            <Pill key={item.href} href={item.href}>
              {item.label}
            </Pill>
          ))}
          <Pill href="/contact" $primary>
            Contact us
          </Pill>
        </Pills>

        <Fine>
          {site.legalName} is an AMFI-registered Mutual Fund Distributor
          {amfi ? ` (${describe(amfi)})` : ""}
          {apmi ? ` and is registered with APMI (${describe(apmi)})` : ""}. Mutual fund
          investments are subject to market risks; read all scheme-related documents
          carefully before investing. Past performance is not indicative of future
          returns. Content on this website is for information only and is not
          personalised investment advice. We do not offer guaranteed returns.{" "}
          <a href={site.scores}>SEBI SCORES</a>
          {" · "}
          <a href={site.smartOdr}>SMART ODR</a>
        </Fine>
        <Bottom>
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
          <Social>
            {site.social.map((item) => {
              const Icon = socialIcons[item.name];
              if (!Icon) return null;
              return (
                <a key={item.name} href={item.href} aria-label={item.name}>
                  <Icon size={15} />
                </a>
              );
            })}
          </Social>
          <span>Designed &amp; developed by Advisorkhoj.com</span>
        </Bottom>
      </Container>
    </Wrap>
  );
}
