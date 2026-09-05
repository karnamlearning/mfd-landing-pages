import { ButtonLink, Container, Display, Lead, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section style={{ paddingTop: 160 }}>
      <Container>
        <Display as="h1">This page is not on the map.</Display>
        <Lead style={{ margin: "16px 0 24px" }}>
          The link may be outdated. Head home, or write to us if you were looking for a
          specific service.
        </Lead>
        <ButtonLink href="/">Back to home</ButtonLink>
      </Container>
    </Section>
  );
}
