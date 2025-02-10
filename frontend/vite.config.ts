import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Only active in dev
  server: {
    proxy: {
      "/api": "http://localhost:16423",
      "/oauth2": "http://localhost:16423",
    },
  },
});
