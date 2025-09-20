import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const proxy = "https://neonnexon-backend.onrender.com/";

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
