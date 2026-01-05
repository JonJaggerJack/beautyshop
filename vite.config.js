import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // Configuration pour le serveur de développement
  server: {
    host: "0.0.0.0", // Accessible sur le réseau local
    port: 5173,
    open: true,
  },

  // Configuration pour le build de production
  build: {
    outDir: "dist",
    sourcemap: false, // Désactiver pour la production
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
        },
      },
    },
  },

  // Alias pour les imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
