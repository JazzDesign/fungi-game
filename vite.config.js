import { defineConfig } from "vite";

export default defineConfig({
  base: "/fungi-game/",
  server: {
    host: true,
  },
  build: {
    assetsInlineLimit: 0,
    target: "es2022",
  },
  esbuild: {
    minifySyntax: false,
  },
});
