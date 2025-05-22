import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  build: {
    sourcemap: true,
    minify: false,
  },
});
