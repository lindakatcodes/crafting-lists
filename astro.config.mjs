import netlify from "@astrojs/netlify";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind()],
  output: "server",
  adapter: netlify()
});