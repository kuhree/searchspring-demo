/* eslint-disable no-redeclare -- as const === type */

export type SiteConfig = typeof SiteConfig;
export const SiteConfig = {
  id: "scmq7n",
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  title: "Searchspring",
  description: "Search for your favorite clothes, gear, and accessories.",
  logo: { src: "vite.svg", alt: "Vite Logo" },
  socials: [
    ["gh", "https://github.com/kuhree/searchspring-demo"],
    ["tw", "https://twitter.com/kuhreee"],
    ["li", "https://linkedin.com/in/khari-johnson"],
  ],

  products: {
    trendingCount: 10, // controls the default number of trending items to fetch
    pageRange: 2, // controls the default number of pages to the left and right to attempt
  },
} as const;

export type SocailKeys = SiteConfig["socials"][number][0];
