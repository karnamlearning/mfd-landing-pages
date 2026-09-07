import type { Metadata } from "next";
import { commissionRows } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { Container, Lead, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Commission Disclosures",
  description: "Illustrative trail commission ranges for mutual fund distribution.",
};

export default function DisclosuresPage() {
  return (
    <>
      <PageHero title="Commission Disclosures" />
      <Section>
        <Container>
          <Lead style={{ marginBottom: 24 }}>
            Figures below are sample template ranges for illustration on this demo site.
            Live books should be replaced with the distributor’s current AMC communication
            for the relevant quarter and city category.
          </Lead>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
                background: "var(--surface-raised)",
              }}
            >
              <thead>
                <tr>
                  {["AMC", "Equity %", "Hybrid %", "Liquid %", "Debt %"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--line)",
                        background: "var(--tint-accent-weak)",
                        color: "var(--ink)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commissionRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td
                        key={cell}
                        style={{
                          padding: "12px 14px",
                          borderBottom: "1px solid var(--line)",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Lead style={{ marginTop: 20 }}>
            Commissions are annualised trail. Structure varies by scheme, city category,
            and quarter. Always read scheme-related documents. Mutual fund investments are
            subject to market risks.
          </Lead>
        </Container>
      </Section>
    </>
  );
}
