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
      "@API": "/src/API",
    },
  },
  build: {
    outDir: "dist", // Especifica la carpeta de salida
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: "/app", // Aquí se debe poner el nombre del repositorio en GitHub
});
