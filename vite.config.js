import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      // PNG — the logo.png is 1.6 MB; aggressive compression still keeps it sharp at nav size
      png: { quality: 75 },
      // JPEG — profile photo and any other JPEGs
      jpg:  { quality: 82 },
      jpeg: { quality: 82 },
      // WebP — if any WebP assets are added later
      webp: { quality: 80 },
    }),
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
