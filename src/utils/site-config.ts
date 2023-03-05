/* eslint-disable no-use-before-define -- as const === type */

export type SiteConfigSchema = typeof SiteConfig;
export const SiteConfig = {
  id: "scmq7n",

  title: "Searchspring Demo",
  description: "Search for your favorite clothes, gear, and accessories.",
  logo: { src: "vite.svg", alt: "Vite Logo" },
  social: [
    ["gh", "https://github.com/kuhree"],
    ["tw", "https://twitter.com/kuhreee"],
    ["li", "https://linkedin.com/in/khari-johnson"],
  ],
} as const;
