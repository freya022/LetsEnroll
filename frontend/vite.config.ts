import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Only active in dev
  server: {
    proxy: {
      "/api": "http://localhost:16423",
      "/oauth2": "http://localhost:16423",
    },
  },
});
