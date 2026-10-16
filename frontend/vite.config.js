import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
 base: "/",
 plugins: [react()],
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
      target: process.env.API_PROXY_TARGET || 'http://localhost:8080',
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
 },
});
