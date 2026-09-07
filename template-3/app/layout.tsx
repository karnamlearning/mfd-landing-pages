import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

const logo = DM_Serif_Display({
  variable: "--font-logo-face",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${logo.variable}`} data-scroll-behavior="smooth">
      <body>
        <StyledComponentsRegistry>
          <MotionProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <ScrollToTop />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <Toaster richColors position="top-right" />
          </MotionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
