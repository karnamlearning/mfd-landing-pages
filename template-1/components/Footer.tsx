"use client";

import Link from "next/link";
import styled from "styled-components";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui";
import { contactIcons, socialIcons } from "@/components/icons";

const Wrap = styled.footer.attrs({ className: "on-dark-scope" })`
  background: var(--surface-darkest);
  color: var(--on-brand);
  padding: 72px 0 28px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr 1fr;
  gap: 36px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ColTitle = styled.h3`
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin: 8px 0 16px;
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  font-size: 14px;
  opacity: 0.88;
`;

const Address = styled.p`
  margin: 18px 0 14px;
  line-height: 1.7;
  font-size: 14px;
  opacity: 0.86;
  white-space: pre-line;
`;

const Fine = styled.p`
  margin-top: 36px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  line-height: 1.7;
  color: var(--on-brand-mute);
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 18px;
  font-size: 13px;
  opacity: 0.72;
`;

const IconRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    flex-shrink: 0;
    opacity: 0.85;
  }
`;

const Social = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  a {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-strong);
    border-radius: 10px;
  }
`;

/* Registration numbers come from lib/site.ts so the disclaimer never drifts
   from the registrations section on the home page. */
const amfi = site.registrations.find((item) => item.label.startsWith("AMFI"));
const apmi = site.registrations.find((item) => item.label.startsWith("APMI"));

function describe(item: typeof amfi) {
  if (!item) return "";
  const valid = "validTill" in item && item.validTill ? `, valid till ${item.validTill}` : "";
  return `${item.value}${valid}`;
}

export function Footer() {
  const Phone = contactIcons.phone;
  const Mail = contactIcons.mail;

  return (
    <Wrap>
      <Container>
        <Grid>
          <div>
            <Logo onDark />
            <Address>{site.address.lines.join("\n")}</Address>
            <List>
              <IconRow>
                <Phone size={14} />
                <a href={site.phoneHref}>{site.phone}</a>
              </IconRow>
              <IconRow>
                <Mail size={14} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </IconRow>
              <IconRow>
                <Mail size={14} />
                <a href={`mailto:${site.advisorEmail}`}>{site.advisorEmail}</a>
              </IconRow>
            </List>
            <Social>
              {site.social.map((item) => {
                const Icon = socialIcons[item.name];
                if (!Icon) return null;
                return (
                  <a key={item.name} href={item.href} aria-label={item.name}>
                    <Icon size={16} />
                  </a>
                );
              })}
            </Social>
          </div>
          <div>
            <ColTitle>Company</ColTitle>
            <List>
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </List>
          </div>
          <div>
            <ColTitle>Offerings</ColTitle>
            <List>
              {footerNav.offerings.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </List>
          </div>
          <div>
            <ColTitle>FAQs</ColTitle>
            <List>
              {footerNav.faqs.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </List>
          </div>
        </Grid>
        <Fine>
          {site.legalName} is an AMFI-registered Mutual Fund Distributor
          {amfi ? ` (${describe(amfi)})` : ""}
          {apmi ? ` and is registered with APMI (${describe(apmi)})` : ""}. Mutual fund
          investments are subject to market risks; read all scheme-related documents
          carefully before investing. Past performance is not indicative of future
          returns. Content on this website is for information only and is not
          personalised investment advice. We do not offer guaranteed returns.
          <br />
          <a href={site.scores}>SEBI SCORES</a>
          {" · "}
          <a href={site.smartOdr}>SMART ODR</a>
        </Fine>
        <Bottom>
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <span>Designed &amp; developed by Advisorkhoj.com</span>
        </Bottom>
      </Container>
    </Wrap>
  );
}
