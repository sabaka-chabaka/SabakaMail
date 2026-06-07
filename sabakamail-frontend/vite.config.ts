import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://176.53.163.27:8080',
        changeOrigin: true,
      },
    },
  },
})
