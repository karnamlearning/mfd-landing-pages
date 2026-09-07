import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { site } from "@/lib/site";
import "./globals.css";

/** Body and UI: a quiet grotesk, small sizes, generous tracking on labels. */
const ui = Geist({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Every headline, the wordmark, and the italic highlight words. Newsreader is
 * a variable font, so weight is left open; the optical-size axis is included
 * so large display sizes get the finer cut.
 */
const serif = Newsreader({
  variable: "--font-serif-face",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
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
    <html lang="en" className={`${ui.variable} ${serif.variable}`} data-scroll-behavior="smooth">
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
