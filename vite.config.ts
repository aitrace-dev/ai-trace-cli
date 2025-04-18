import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    viteSingleFile({
      removeViteModuleLoader: true,
      useRecommendedBuildConfig: true
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '', // Use empty base to make all assets use relative paths
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000, // Inline all assets (100MB limit)
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
}));
