import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Inject a <link rel="preload"> for the CSS bundle at the top of <head> so the
// browser starts downloading the stylesheet before it encounters the render-blocking
// <link rel="stylesheet"> that Vite appends at the end of <head>.
function preloadCssPlugin() {
  return {
    name: "preload-css",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const css = Object.values(ctx.bundle).find(
          (c) => c.type === "asset" && c.fileName.endsWith(".css"),
        );
        if (!css) return html;
        return {
          html,
          tags: [
            {
              tag: "link",
              attrs: { rel: "preload", as: "style", href: `/${css.fileName}` },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png:  { quality: 75 },
      jpg:  { quality: 82 },
      jpeg: { quality: 82 },
      webp: { quality: 80 },
    }),
    preloadCssPlugin(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    assetsInlineLimit: 4096,
    // Ship real sourcemaps. Browsers never fetch them during normal browsing (only DevTools
    // does, on demand) — this is a Lighthouse Best Practices signal, not a runtime cost.
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/gsap/") || id.includes("node_modules/lenis/")) {
            return "vendor-anim";
          }
          if (id.includes("node_modules/three/")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-lucide";
          }
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
  },
});
