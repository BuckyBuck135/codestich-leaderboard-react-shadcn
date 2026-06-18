// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import netlify from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["astro:actions", "astro/actions/runtime/entrypoints/client.js"],
    },
  },
  integrations: [react()],
})
