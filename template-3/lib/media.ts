/**
 * Photography for the high-contrast home page. Images are treated as grayscale in CSS.
 *
 * All photos are free-license (Unsplash License) images of Indian people and
 * settings, served locally from /public/images. Photo sources are listed in
 * /public/images/CREDITS.md.
 */

export const photos = {
  hero: "/images/indian-family.jpg",
  featured: "/images/featured-office-meeting.jpg",
  aboutA: "/images/about-friends.jpg",
  aboutB: "/images/about-grandparents.jpg",
  aboutC: "/images/about-women.jpg",
  why: "/images/why-father-child.jpg",
  contact: "/images/contact-cafe.jpg",
  portrait: "/images/portrait-farhan.jpg",
  faces: [
    "/images/face-1.jpg",
    "/images/face-2.jpg",
    "/images/face-3.jpg",
    "/images/face-4.jpg",
    "/images/face-5.jpg",
  ],
  /* Client impact stories, in the order used on the home page. */
  storyA: "/images/face-2.jpg",
  storyB: "/images/face-4.jpg",
  storyC: "/images/face-3.jpg",
  /* Service pillars, in the order used on the home page. */
  caseA: "/images/case-onboarding.jpg",
  caseB: "/images/case-scheme-selection.jpg",
  caseC: "/images/case-sip.jpg",
  caseD: "/images/case-portfolio.jpg",
  caseE: "/images/case-goals.jpg",
  caseF: "/images/case-retirement.jpg",
  /* Resource cards. */
  resourceSip: "/images/resource-sip-rupees.jpg",
  resourceRetirement: "/images/resource-retirement-couple.jpg",
  resourceBlog: "/images/resource-coins.jpg",
} as const;
