import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@admin": "/src/components/admin",
      "@staff": "/src/components/staff",
      "@professional": "/src/components/professional",
      "@client": "/src/components/client",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@shared-theme": "/src/shared-theme",
      "@layouts": "/src/layouts",
      "@routes": "/src/routes",
      "@styles": "/src/styles",
      "@shared": "/src/shared",
      "@types": "/src/types",
      "@hooks": "/src/hooks",
      "@store": "/src/utils/store.ts",
      "@data": "/src/data",
      "@forms": "/src/components/forms",
      "@pages": "/src/pages",
      "@buttons": "/src/components/buttons",
    },
  },
  base: '/ASPY/aspy-web/',
});
