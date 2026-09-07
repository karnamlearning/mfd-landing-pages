import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/* A second sans for headings: Sora is rounder and more geometric than Manrope,
   so titles read as a distinct voice while the body stays quiet. */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable}`}
      data-scroll-behavior="smooth"
    >
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
