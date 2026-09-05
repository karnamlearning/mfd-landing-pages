"use client";

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { toast } from "sonner";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Button, Container } from "@/components/ui";
import { contactIcons, socialIcons } from "@/components/icons";

const Wrap = styled.footer.attrs({ className: "on-dark-scope" })`
  background: var(--surface-darkest);
  color: var(--on-brand);
  padding: 80px 0 28px;
`;

const News = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 32px;
  align-items: end;
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--line);

  h2 {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 600;
    letter-spacing: -0.03em;
    max-width: 16ch;
  }

  p {
    color: var(--muted);
    margin-top: 10px;
    max-width: 46ch;
    line-height: 1.65;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  min-height: 50px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
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
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
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
  margin: 18px 0 14px;
  line-height: 1.7;
  font-size: 14px;
  color: var(--muted);
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
    border-radius: 50%;
  }
`;

const Chip = styled.span`
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
`;

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
  const [email, setEmail] = useState("");

  return (
    <Wrap>
      <Container>
        <News>
          <div>
            <h2>Subscribe to our notes</h2>
            <p>Get the latest planning insights and market context delivered to your inbox.</p>
          </div>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.trim()) return;
              toast.success("Thanks — we will be in touch with the next note.");
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
            <Button type="submit">Subscribe</Button>
          </Form>
        </News>
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
            <ColTitle>Services</ColTitle>
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
