import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isLib = process.env.BUILD_LIB === "true";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: isLib
    ? {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "ReactEnahncedImage",
          fileName: (format) => `react-enhanced-image.${format}.js`,
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
      }
    : {},
  root: isLib ? "." : "demo",
});
