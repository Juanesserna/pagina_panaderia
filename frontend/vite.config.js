import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(import.meta.dirname, './src/app'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
      '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@styles': path.resolve(import.meta.dirname, './src/styles'),
    },
  },
  build: {
    rollupOptions: {
      external: ['xlsx', 'jspdf', 'jspdf-autotable'],
    },
  },
})