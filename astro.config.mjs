import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind({
    applyBaseStyles: false
  })],
  output: "server",
  adapter: netlify()
});