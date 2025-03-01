import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailiwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
