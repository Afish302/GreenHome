import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
 base: "/",
 plugins: [
  react(),
  tailwindcss(),
  ],
 preview: {
  //Change to our app port 3000
  port: 3000,
  strictPort: true,
 },
 server: {
  host: true,
  port: 3000,
  strictPort: true,
  //Add proxy to link up express backend with app https://vite.dev/config/server-options
  proxy: {
    '/api': {
      target: process.env.API_PROXY_TARGET || 'http://backend:80', // map to port 80 inside docker container
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
 },
});
