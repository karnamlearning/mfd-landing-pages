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
      <PageHero title="Our Team" />
      <Section>
        <Container>
          <Grid $cols={2}>
            {team.map((member) => (
              <Card key={member.name}>
                <p
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "var(--surface-dark)",
                    color: "var(--accent-soft)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: 24,
                    marginBottom: 18,
                  }}
                >
                  {member.initials}
                </p>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 32 }}>{member.name}</h2>
                <p style={{ color: "var(--accent-text)", margin: "8px 0 14px", fontWeight: 700 }}>
                  {member.role}
                </p>
                <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{member.bio}</p>
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
