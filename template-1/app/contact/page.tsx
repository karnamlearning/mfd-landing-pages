import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { ContactAside } from "@/components/ContactAside";
import { PageHero } from "@/components/PageHero";
import { Card, Container, Eyebrow, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Speak with ${site.name} in ${site.address.city}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" />
      <Section>
        <Container>
          <div className="contact-grid">
            <ContactAside />
            <Card>
              <Eyebrow>Get in touch</Eyebrow>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 32,
                  margin: "8px 0 18px",
                }}
              >
                Request a callback
              </h2>
              <LeadForm />
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
