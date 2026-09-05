import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Container, Lead, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <Section>
        <Container style={{ maxWidth: 760 }}>
          <Lead>
            {site.legalName} collects the information you submit on this website (name,
            email, phone, and planning context) so we can respond to consultation
            requests. We do not sell personal data.
          </Lead>
          <Lead style={{ marginTop: 16 }}>
            Forms post to a lead endpoint that will be connected to the firm’s CRM. Until
            that integration is live, submissions may not be stored. Do not send passwords,
            OTPs, or full KYC documents through this site.
          </Lead>
          <Lead style={{ marginTop: 16 }}>
            We use only essential cookies required to operate the site. For questions,
            write to {site.email}.
          </Lead>
        </Container>
      </Section>
    </>
  );
}
