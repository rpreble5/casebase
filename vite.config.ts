import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function shortSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
}

// GitHub Pages serves the site from /<repo>/, so built asset URLs need the repo
// name as their base. Dev stays at / so `npm run dev` works normally.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/casebase/" : "/",
  plugins: [react()],
  define: {
    // Stamped into the UI so there's never any doubt whether the live site is
    // showing the newest push or a cached older one.
    __BUILD_SHA__: JSON.stringify(shortSha()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
}));
