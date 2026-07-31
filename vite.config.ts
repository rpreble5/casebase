import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the site from /<repo>/, so built asset URLs need the repo
// name as their base. Dev stays at / so `npm run dev` works normally.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/casebase/" : "/",
  plugins: [react()],
}));
