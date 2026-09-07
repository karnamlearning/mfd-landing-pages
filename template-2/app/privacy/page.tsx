import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LegalDoc } from "@/components/LegalDoc";
import { Container, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <Section>
        <Container>
          <LegalDoc>
            <p>
              {site.legalName} collects the information you submit on this website (name,
              email, phone, and planning context) so we can respond to consultation requests
              and service your investments. We do not sell personal data.
            </p>

            <h2>What we collect</h2>
            <ul>
              <li>Contact details you enter in a form: name, email address, and phone number.</li>
              <li>Planning context you choose to share: goals, horizon, and approximate amounts.</li>
              <li>Basic technical data needed to operate the site, such as browser type.</li>
            </ul>

            <h2>How we use it</h2>
            <p>
              Forms post to a lead endpoint that is connected to the firm’s CRM. Submissions are
              used only to contact you about your request and to complete onboarding you have
              asked for. Do not send passwords, OTPs, or full KYC documents through this site;
              those are collected through the official KYC and transaction channels.
            </p>

            <h2>Cookies</h2>
            <p>
              We use only essential cookies required to operate the site. No advertising or
              cross-site tracking cookies are set.
            </p>

            <h2>Your rights</h2>
            <p>
              You may ask us to correct or delete the personal data we hold about you. Write to{" "}
              {site.email} or call {site.phone} and we will respond within a reasonable time.
            </p>
          </LegalDoc>
        </Container>
      </Section>
    </>
  );
}
