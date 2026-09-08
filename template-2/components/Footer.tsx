"use client";

import Link from "next/link";
import styled from "styled-components";
import { footerNav, site } from "@/lib/site";
import { AmfiRegistrationMark } from "@/components/AmfiRegistrationMark";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui";
import { socialIcons } from "@/components/icons";

/*
 * Cream footer with three link columns, the way the reference lays out
 * "Site / What we take on / Reach us", then the regulatory fine print.
 */

const Wrap = styled.footer`
  background: var(--surface);
  color: var(--ink);
  padding: 88px 0 32px;
  border-top: 1px solid var(--line);
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 48px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Blurb = styled.p`
  margin-top: 22px;
  max-width: 34ch;
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted);
`;

const ColTitle = styled.h3`
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 6px 0 20px;
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 12px;
  font-size: 14.5px;
  color: var(--ink);

  a:hover {
    color: var(--brand);
  }
`;

const Reach = styled.ul`
  list-style: none;
  display: grid;
  gap: 12px;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink);

  a:hover {
    color: var(--brand);
  }

  small {
    display: block;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
`;

const Social = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 26px;

  a {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-strong);
    border-radius: 50%;
    color: var(--ink);
    transition: 0.15s ease;
  }

  a:hover {
    background: var(--brand-deep);
    border-color: var(--brand-deep);
    color: var(--on-brand);
  }
`;

const Fine = styled.div`
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 3fr);
  gap: 48px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--muted);

  a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 28px;
  font-size: 12.5px;
  color: var(--muted);

  a {
    color: var(--ink);
  }
`;

type Registration = (typeof site.registrations)[number];

function describe(item: Registration) {
  return `${item.value}${item.detail ? `, ${item.detail}` : ""}`;
}

const amfiText = site.registrations
  .filter((item) => item.label.startsWith("AMFI"))
  .map(describe)
  .join("; ");

export function Footer() {
  return (
    <Wrap>
      <Container>
        <Top>
          <div>
            <Logo showAmfiTag={false} />
            <Blurb>{site.blurb}</Blurb>
            <Social>
              {site.social.map((item) => {
                const Icon = socialIcons[item.name];
                if (!Icon) return null;
                return (
                  <a key={item.name} href={item.href} aria-label={item.name}>
                    <Icon size={14} />
                  </a>
                );
              })}
            </Social>
          </div>
          <div>
            <ColTitle>Site</ColTitle>
            <List>
              {footerNav.site.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </List>
          </div>
          <div>
            <ColTitle>What we handle</ColTitle>
            <List>
              {footerNav.handle.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </List>
          </div>
          <div>
            <ColTitle>Reach us</ColTitle>
            <Reach>
              <li>
                <small>Phone</small>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <small>Email</small>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <small>Office</small>
                <span>{site.address.lines.slice(1).join(" ")}</span>
              </li>
              <li>
                <small>Hours</small>
                <span>{site.hours}</span>
              </li>
            </Reach>
          </div>
        </Top>
      </Container>
      <AmfiRegistrationMark />
      <Container>
        <Fine>
          <div>
            {footerNav.legal.map((item, index) => (
              <span key={item.href}>
                {index > 0 ? " · " : ""}
                <Link href={item.href}>{item.label}</Link>
              </span>
            ))}
            <br />
            <a href={site.scores}>SEBI SCORES</a>
            {" · "}
            <a href={site.smartOdr}>SMART ODR</a>
          </div>
          <p>
            {site.legalName} is an AMFI-registered Mutual Fund Distributor
            {amfiText ? ` (${amfiText})` : ""}. Mutual fund
            investments are subject to market risks; read all scheme-related documents
            carefully before investing. Past performance is not indicative of future
            returns. Content on this website is for information only and is not
            personalised investment advice. We do not offer guaranteed returns.
          </p>
        </Fine>
        <Bottom>
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
          <span>Designed &amp; developed by Advisorkhoj.com</span>
        </Bottom>
      </Container>
    </Wrap>
  );
}
