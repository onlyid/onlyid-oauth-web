import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"

// prettier-ignore
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/oauth/",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
      'my': fileURLToPath(new URL('./src/my', import.meta.url)),
      'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true
      }
    }
  }
})
