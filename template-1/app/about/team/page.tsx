import type { Metadata } from "next";
import { team } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ButtonLink, Card, Container, Grid, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Team",
  description: "The advisors and planners behind your financial plan.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero title="Our Team" meta="Who you will work with" />
      <Section>
        <Container>
          <Grid $cols={2}>
            {team.map((member) => (
              <Card key={member.name}>
                <p
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "var(--brand-deep)",
                    color: "var(--on-brand)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    fontWeight: 750,
                    letterSpacing: "0.04em",
                    marginBottom: 18,
                  }}
                >
                  {member.initials}
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>{member.name}</h2>
                <p style={{ color: "var(--accent-text)", margin: "6px 0 12px", fontWeight: 700, fontSize: 14 }}>
                  {member.role}
                </p>
                <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15 }}>{member.bio}</p>
              </Card>
            ))}
          </Grid>
          <ButtonLink href="/contact" style={{ marginTop: 32 }}>
            Speak with the team
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
