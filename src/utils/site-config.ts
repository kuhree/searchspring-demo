/* eslint-disable no-redeclare -- as const === type */

export type SiteConfig = typeof SiteConfig;
export const SiteConfig = {
  id: "scmq7n",

  title: "Searchspring",
  description: "Search for your favorite clothes, gear, and accessories.",
  logo: { src: "vite.svg", alt: "Vite Logo" },
  socials: [
    ["gh", "https://github.com/kuhree"],
    ["tw", "https://twitter.com/kuhreee"],
    ["li", "https://linkedin.com/in/khari-johnson"],
  ],
} as const;

export type SocailKeys = SiteConfig["socials"][number][0];
