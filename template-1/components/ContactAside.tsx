"use client";

import styled from "styled-components";
import { site } from "@/lib/site";
import { contactIcons } from "@/components/icons";
import { ButtonLink, Card, Eyebrow } from "@/components/ui";

const Row = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 10px 0;
  line-height: 1.6;

  svg {
    margin-top: 3px;
    flex-shrink: 0;
    color: var(--brand);
  }
`;

export function ContactAside() {
  const Phone = contactIcons.phone;
  const Mail = contactIcons.mail;
  const Map = contactIcons.map;
  const Clock = contactIcons.clock;

  return (
    <Card>
      <Eyebrow>Office</Eyebrow>
      <Row>
        <Map size={16} />
        <span style={{ whiteSpace: "pre-line" }}>{site.address.lines.join("\n")}</span>
      </Row>
      <Row>
        <Phone size={16} />
        <a href={site.phoneHref}>{site.phone}</a>
      </Row>
      <Row>
        <Mail size={16} />
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </Row>
      <Row>
        <Clock size={16} />
        <span>{site.hours}</span>
      </Row>
      <ButtonLink
        href={site.address.mapUrl}
        $variant="navy"
        style={{ marginTop: 18 }}
        target="_blank"
        rel="noreferrer"
      >
        Open map
      </ButtonLink>
    </Card>
  );
}
