import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  optimizeDeps: {
    include: ['@mui/material', '@mui/x-date-pickers', 'dayjs'],
  },
  server: {
    host: true,   // allow access from subdomains
    // allowedHosts: ['.lvh.me', 'localhost'],
  }
});
