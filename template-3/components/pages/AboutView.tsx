"use client";

import { philosophy, processSteps, team } from "@/lib/content";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { IconBadge, philosophyIcons, processIcons } from "@/components/icons";
import { Item, Reveal, Stagger } from "@/components/motion";
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  Grid,
  Lead,
  Section,
  SectionTitle,
} from "@/components/ui";

const amfi = site.registrations.find((item) => item.label.startsWith("AMFI"));
const apmi = site.registrations.find((item) => item.label.startsWith("APMI"));

export function AboutView() {
  return (
    <>
      <PageHero title="About Us" />
      <Section>
        <Container>
          <Reveal>
            <Lead>
              {site.name} is an AMFI-registered mutual fund distributor based in{" "}
              {site.address.city}. Since {site.foundedYear}, we have helped individuals,
              families, and NRIs as an AMFI-registered mutual fund distributor - from
              onboarding and scheme selection to SIPs, transactions, and ongoing
              portfolio service.
            </Lead>
            <Lead style={{ marginTop: 16 }}>
              Our role is to match your savings to your goals, build a portfolio you can
              stay invested in, and review it regularly. Commission structures and
              registrations are disclosed on this website.
            </Lead>
          </Reveal>
        </Container>
      </Section>
      <Section $tone="paper">
        <Container>
          <Stagger>
            <Grid>
              <Item>
                <Card>
                  <Eyebrow>Mission</Eyebrow>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: "8px 0 12px" }}>
                    Help every family we work with reach their goals with a clear plan.
                  </h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                    A written plan, disciplined investing, and the support to stay the
                    course through market cycles.
                  </p>
                </Card>
              </Item>
              <Item>
                <Card>
                  <Eyebrow>Vision</Eyebrow>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: "8px 0 12px" }}>
                    Be the trusted first call for every financial decision.
                  </h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                    Whether that is opening a folio, starting a SIP, or reviewing the
                    portfolio, we want to be the distributor you consult before you act.
                  </p>
                </Card>
              </Item>
              <Item>
                <Card>
                  <Eyebrow>Since {site.foundedYear}</Eyebrow>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: "8px 0 12px" }}>
                    Registered, regulated, and transparent.
                  </h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                    {[amfi ? `AMFI ${amfi.value}` : null, apmi ? `APMI ${apmi.value}` : null]
                      .filter(Boolean)
                      .join(" and ")}
                    . Mutual fund distribution with open architecture across fund houses.
                  </p>
                </Card>
              </Item>
            </Grid>
          </Stagger>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <SectionTitle>Our Philosophy</SectionTitle>
          </Reveal>
          <Stagger>
            <Grid style={{ marginTop: 28 }}>
              {philosophy.map((item, index) => (
                <Item key={item.title}>
                  <Card>
                    <IconBadge icon={philosophyIcons[index]} />
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginTop: 14 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.7 }}>
                      {item.body}
                    </p>
                  </Card>
                </Item>
              ))}
            </Grid>
          </Stagger>
        </Container>
      </Section>
      <Section $tone="ink">
        <Container>
          <Reveal>
            <SectionTitle>
              Our <em>Process</em>
            </SectionTitle>
          </Reveal>
          <Stagger stagger={0.12}>
            <Grid $cols={4} style={{ marginTop: 28 }}>
              {processSteps.map((step, index) => (
                <Item key={step.n}>
                  <div>
                    <IconBadge icon={processIcons[index]} tone="dark" />
                    <Eyebrow style={{ marginTop: 14 }}>{step.n}</Eyebrow>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>{step.title}</h3>
                    <p style={{ color: "var(--on-brand-soft)", marginTop: 8 }}>{step.body}</p>
                  </div>
                </Item>
              ))}
            </Grid>
          </Stagger>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <SectionTitle>Our Team</SectionTitle>
          </Reveal>
          <Stagger>
            <Grid $cols={4} style={{ marginTop: 28 }}>
              {team.map((member) => (
                <Item key={member.name}>
                  <Card>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: "var(--accent)",
                        color: "var(--ink)",
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        fontWeight: 750,
                        marginBottom: 16,
                      }}
                    >
                      {member.initials}
                    </div>
                    <h3>{member.name}</h3>
                    <p style={{ color: "var(--accent-text)", fontSize: 13, margin: "6px 0 10px" }}>
                      {member.role}
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                      {member.bio}
                    </p>
                  </Card>
                </Item>
              ))}
            </Grid>
          </Stagger>
          <ButtonLink href="/about/team" $variant="navy" style={{ marginTop: 28 }}>
            Meet the full team
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
