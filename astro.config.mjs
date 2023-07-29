import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "http://weilinshi.org",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      langs: ["js", "ts"],
    },
  },
  experimental: {
    viewTransitions: true,
  },
});
