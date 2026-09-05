"use client";

import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiClock,
  FiBookOpen,
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

const Mark = styled.span<{ $tone?: "light" | "dark" }>`
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ $tone }) =>
    $tone === "dark" ? "var(--tint-accent)" : "var(--tint-accent-weak)"};
  color: ${({ $tone }) => ($tone === "dark" ? "var(--accent-soft)" : "var(--accent-strong)")};
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  line-height: 1;
`;

type IconSet = "service" | "calculator";

/**
 * Server Components cannot pass a component reference across the client
 * boundary, so they pass a `name` (+ `set`) and the lookup happens here.
 * Client callers can keep passing `icon` directly.
 */
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

export const serviceIcons: Record<string, IconType> = {
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
};

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

/**
 * Icons for dropdown children, keyed by href. Only the Insights menu is mapped
 * - the other menus are plain lists, and half-iconed rows read as broken.
 */
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

/** Icons for the home page stat band, keyed by the `icon` field in site.stats. */
export const statIcons: Record<string, IconType> = {
  years: FiClock,
  families: FiUsers,
  assets: FiBriefcase,
  amcs: FiLayers,
};
