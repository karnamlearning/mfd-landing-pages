/**
 * Photography for the editorial home layout.
 *
 * All photos are free-license (Unsplash License) images of Indian people and
 * settings, served locally from /public/images and shown in full colour.
 * Sources are listed in /public/images/CREDITS.md.
 */

export const photos = {
  /** Hero portrait column: an Indian family, cropped tall. */
  hero: "/images/indian-family.jpg",
  /** Small client faces for the rating row. */
  faces: [
    "/images/face-1.jpg",
    "/images/face-2.jpg",
    "/images/face-3.jpg",
    "/images/face-4.jpg",
  ],
  /** "What we handle" cards, in order. */
  handle: [
    "/images/case-scheme-selection.jpg",
    "/images/case-onboarding.jpg",
    "/images/case-portfolio.jpg",
    "/images/why-father-child.jpg",
  ],
  /** "In their words" photo card. */
  words: "/images/about-grandparents.jpg",
  /** Full-bleed band between the logos and the arithmetic. */
  reel: "/images/featured-office-meeting.jpg",
  /** One photo per question in "What people ask first". */
  questions: [
    "/images/case-onboarding.jpg",
    "/images/case-sip.jpg",
    "/images/compounding.jpg",
    "/images/case-portfolio.jpg",
    "/images/case-goals.jpg",
    "/images/contact-cafe.jpg",
  ],
  /** Beside the contact form. */
  contact: "/images/portrait-farhan.jpg",
  /** Journal card fallbacks. */
  journal: [
    "/images/resource-sip-rupees.jpg",
    "/images/resource-coins.jpg",
    "/images/resource-retirement-couple.jpg",
  ],
} as const;
