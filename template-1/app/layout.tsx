import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const logo = Playfair_Display({
  variable: "--font-logo-face",
  subsets: ["latin"],
  weight: "700",
  style: "italic",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* Palette preset: "paper" | "emerald" | "sapphire" - defined in app/globals.css */
    <html lang="en" data-palette="paper" className={`${manrope.variable} ${logo.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <MotionProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
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
