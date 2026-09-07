"use client";

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { toast } from "sonner";
import { footerNav, site } from "@/lib/site";
import { Button, Container } from "@/components/ui";
import { contactIcons, socialIcons } from "@/components/icons";

const News = styled.section`
  background: var(--accent);
  color: var(--ink);
  padding: 28px 0;
`;

const NewsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 1.1fr);
  gap: 24px;
  align-items: center;

  h2 {
    font-family: var(--font-display);
    font-size: clamp(22px, 2.6vw, 32px);
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 0;
  min-width: 0;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid var(--ink);
  background: transparent;
  color: var(--ink);
  font-size: 14px;

  &::placeholder {
    color: rgb(12 12 12 / 0.55);
  }

  &:focus {
    outline: none;
    background: rgb(255 255 255 / 0.35);
  }
`;

const Wrap = styled.footer.attrs({ className: "on-dark-scope" })`
  background: var(--surface-darkest);
  color: var(--on-brand);
  padding: 72px 0 28px;
`;

const Brand = styled.p`
  font-family: var(--font-display);
  font-size: clamp(56px, 12vw, 148px);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.86;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
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
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 8px 0 16px;
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  font-size: 14px;
  color: var(--on-brand-soft);
`;

const Address = styled.p`
  margin: 0 0 14px;
  line-height: 1.7;
  font-size: 14px;
  color: var(--on-brand-mute);
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
    color: var(--accent);
  }
`;

const Social = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;

  a {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-strong);
  }

  a:hover {
    background: var(--accent);
    color: var(--ink);
    border-color: var(--accent);
  }
`;

const Chip = styled.span`
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 8px 12px;
  border: 1px solid var(--line);
  font-size: 12px;
  font-weight: 650;
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
  const Phone = contactIcons.phone;
  const Mail = contactIcons.mail;
  const [email, setEmail] = useState("");

  return (
    <>
      <News>
        <Container>
          <NewsRow>
            <h2>Subscribe to our newsletter</h2>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) return;
                toast.success("Thanks - we will be in touch with the next note.");
                setEmail("");
              }}
            >
              <Input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Email address"
              />
              <Button type="submit" $variant="navy">
                Subscribe
              </Button>
            </Form>
          </NewsRow>
        </Container>
      </News>
      <Wrap>
        <Container>
          <Brand>{site.shortName}</Brand>
          <Grid>
            <div>
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
              <ColTitle>Site map</ColTitle>
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
              <ColTitle>Certification</ColTitle>
              {site.registrations.slice(0, 3).map((item) => (
                <Chip key={item.value}>
                  {item.label}: {item.value}
                </Chip>
              ))}
            </div>
          </Grid>
          <Fine>
            {site.legalName} is an AMFI-registered Mutual Fund Distributor
            {amfiText ? ` (${amfiText})` : ""}. Mutual fund
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
            <span>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </span>
            <span>Designed &amp; developed by Advisorkhoj.com</span>
          </Bottom>
        </Container>
      </Wrap>
    </>
  );
}
