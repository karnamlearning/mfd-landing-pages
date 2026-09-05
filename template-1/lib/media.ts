/**
 * Photography for the home page.
 *
 * All photos are free-license (Unsplash License) images, served locally from
 * /public/images. Sources are listed in /public/images/CREDITS.md.
 */

export const photos = {
  /* Hero: a sapling growing out of a pile of coins - growth, literally. */
  hero: "/images/growth-plant-coins.jpg",
  /* Small client faces for the trust row under the hero copy. */
  faces: [
    "/images/face-1.jpg",
    "/images/face-2.jpg",
    "/images/face-3.jpg",
    "/images/face-4.jpg",
    "/images/face-5.jpg",
  ],
  /* Calculators teaser. */
  calculators: "/images/resource-coins.jpg",
  /* Insight cards, used when a post has no image of its own. */
  insightA: "/images/compounding.jpg",
  insightB: "/images/about-friends.jpg",
} as const;
