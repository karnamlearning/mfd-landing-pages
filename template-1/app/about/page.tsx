import type { Metadata } from "next";
import { site } from "@/lib/site";
import { AboutView } from "@/components/pages/AboutView";

export const metadata: Metadata = {
  title: "About Us",
  description:
    `Who we are, how we work, and what to expect from ${site.name}.`,
};

export default function AboutPage() {
  return <AboutView />;
}
