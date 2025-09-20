import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const proxy = "http://localhost:8000";

export default defineConfig({
  server: {
    proxy: {
      '/api/neonNexa.users': {
        target: proxy,
        changeOrigin: true,
      }
    }
  },
  plugins: [react(), tailwindcss()],
})
