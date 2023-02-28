export type SiteConfig = typeof SiteConfig;
export const SiteConfig = {
  id: "scmq7n",
  baseUrl: "http://api.searchspring.net/api/search/search.json",
  title: "Searchspring Demo",
  description: "Perform your searches",
  logo: { src: "/vite.svg", alt: "Vite Logo" },
  themes: ["light", "dark"],
} as const;
