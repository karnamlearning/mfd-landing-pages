"use client";

import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiClock,
  FiBookOpen,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPercent,
  FiPhone,
  FiPieChart,
  FiPlayCircle,
  FiRadio,
  FiRefreshCw,
  FiShield,
  FiSunrise,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import styled from "styled-components";
import { services } from "@/lib/services";

const Mark = styled.span<{ $tone?: "light" | "dark" }>`
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: ${({ $tone }) =>
    $tone === "dark" ? "var(--on-brand-veil-strong)" : "var(--tint-accent-weak)"};
  color: ${({ $tone }) => ($tone === "dark" ? "var(--accent)" : "var(--brand)")};
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  line-height: 1;
`;

type IconSet = "service" | "calculator";

export function IconBadge({
  icon,
  name,
  set = "service",
  tone = "light",
}: {
  icon?: IconType;
  name?: string;
  set?: IconSet;
  tone?: "light" | "dark";
}) {
  const Icon =
    icon ?? (name ? (set === "calculator" ? calculatorIcons : serviceIcons)[name] : undefined);
  if (!Icon) return null;
  return (
    <Mark $tone={tone} aria-hidden>
      <Icon size={20} />
    </Mark>
  );
}

function serviceIconFor(slug: string): IconType {
  if (slug.startsWith("insurance") || slug.includes("policy") || slug.includes("claim") || slug.includes("premium") || slug.includes("rider") || slug.includes("nomination") || slug.includes("term-") || slug.includes("health") || slug.includes("motor") || slug.includes("travel") || slug.includes("accident") || slug.includes("home-property") || slug.includes("business-insurance") || slug.includes("life-insurance") || slug.includes("customer-education") || slug.includes("documentation") || slug.includes("post-sale")) {
    return FiShield;
  }
  if (slug.startsWith("fd-") || slug.includes("bond") || slug.includes("corporate") || slug.includes("government") || slug.includes("ladder") || slug.includes("yield") || slug.includes("liquidity") || slug.includes("credit-risk") || slug.includes("maturity") || slug.includes("reinvestment") || slug.includes("tds") || slug.includes("secondary") || slug.includes("fi-") || slug.includes("tax-saving-fixed") || slug.includes("regular-income") || slug.includes("interest-") || slug.includes("investor-statements")) {
    return FiLayers;
  }
  return FiBriefcase;
}

const explicitServiceIcons: Record<string, IconType> = {
  "investor-onboarding": FiUsers,
  "investor-profiling": FiClipboard,
  "scheme-selection": FiPieChart,
  "sip-services": FiRefreshCw,
  "lumpsum-investments": FiTrendingUp,
  "transaction-execution": FiPlayCircle,
  "portfolio-monitoring": FiActivity,
  "goal-based-investing": FiHome,
  "retirement-planning": FiSunrise,
  "tax-capital-gains": FiPercent,
  "investor-service": FiHelpCircle,
  "insurance-needs-analysis": FiClipboard,
  "life-insurance-planning": FiShield,
  "term-insurance": FiShield,
  "health-insurance": FiActivity,
  "claims-assistance": FiFileText,
  "fd-product-selection": FiLayers,
  "bond-selection": FiTrendingUp,
  "laddering-strategy": FiCalendar,
  "credit-risk-assessment": FiHelpCircle,
};

/**
 * Every service slug resolved once at module load, so IconBadge only ever does
 * a lookup - never a function call that returns a component during render.
 */
export const serviceIcons: Record<string, IconType> = Object.fromEntries(
  services.map((item) => [item.slug, explicitServiceIcons[item.slug] ?? serviceIconFor(item.slug)]),
);

export const philosophyIcons = [FiShield, FiUsers, FiClipboard] as const;

export const processIcons = [FiClipboard, FiCalendar, FiPlayCircle, FiRefreshCw] as const;

export const contactIcons = {
  phone: FiPhone,
  mail: FiMail,
  map: FiMapPin,
  clock: FiClock,
  help: FiHelpCircle,
  briefcase: FiBriefcase,
};

export const socialIcons: Record<string, IconType> = {
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
};

export const navIcons: Record<string, IconType> = {
  "/blog": FiBookOpen,
  "/news": FiRadio,
  "/faqs": FiHelpCircle,
};

export const calculatorIcons: Record<string, IconType> = {
  "become-a-crorepati": FiTrendingUp,
  "sip-return": FiRefreshCw,
  "retirement-planning": FiSunrise,
  "sip-step-up": FiActivity,
  "lumpsum-target": FiPercent,
  "children-education": FiBookOpen,
  "target-amount-sip": FiHome,
};

export const statIcons: Record<string, IconType> = {
  years: FiClock,
  families: FiUsers,
  assets: FiBriefcase,
  amcs: FiLayers,
};
