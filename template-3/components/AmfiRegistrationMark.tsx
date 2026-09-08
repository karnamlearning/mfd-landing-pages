"use client";

import Image from "next/image";
import styled from "styled-components";
import { site } from "@/lib/site";
import { Container } from "@/components/ui";

const Strip = styled.section`
  background: #fff;
  color: #1a1a1a;
  border-top: 1px solid rgb(0 0 0 / 0.08);
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
  margin: 40px 0 0;
  padding: 18px 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 18px 24px;
  flex-wrap: wrap;
`;

const Logo = styled.div`
  flex-shrink: 0;
  width: 58px;
  line-height: 0;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const Copy = styled.div`
  min-width: 0;
  flex: 1;
`;

const Title = styled.p`
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
  color: #111;
`;

const Line = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: #444;

  & + & {
    margin-top: 2px;
  }
`;

function formatArn(value: string) {
  return value.replace(/^ARN-?/i, "");
}

type Registration = (typeof site.registrations)[number] & {
  registeredOn?: string;
  validTill?: string;
};

function describeArn(item: Registration) {
  const arn = formatArn(item.value);
  const euin = item.detail?.replace(/^EUIN-?\s*/i, "") ?? "";
  return euin ? `ARN No. ${arn}, EUIN ${euin}` : `ARN No. ${arn}`;
}

export function AmfiRegistrationMark() {
  const amfiRegs = site.registrations.filter((item) =>
    item.label.startsWith("AMFI"),
  ) as Registration[];

  if (!amfiRegs.length) return null;

  const arnLine = amfiRegs.map(describeArn).join("  |  ");
  const dates = amfiRegs
    .filter((item) => item.registeredOn && item.validTill)
    .map(
      (item) =>
        `ARN ${formatArn(item.value)}: Initial Registration on - ${item.registeredOn} | Valid till - ${item.validTill}`,
    );

  return (
    <Strip aria-label={site.amfiMark.tagline}>
      <Container>
        <Row>
          <Logo>
            <Image
              src="/images/amfi-logo.svg?v=2"
              alt="AMFI"
              width={58}
              height={52}
              unoptimized
            />
          </Logo>
          <Copy>
            <Title>{site.amfiMark.tagline}</Title>
            <Line>
              AMFI ( Association of Mutual Funds in India ) Certified Mutual Fund
              Distributor
            </Line>
            <Line>{arnLine}</Line>
            {dates.map((line) => (
              <Line key={line}>{line}</Line>
            ))}
          </Copy>
        </Row>
      </Container>
    </Strip>
  );
}
