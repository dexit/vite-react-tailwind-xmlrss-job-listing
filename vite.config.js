import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
/*  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name][hash].[ext]`,
        chunkFileNames: `assets/[name][hash].[ext]`,
        assetFileNames: `assets/[name][hash].[ext]`
      }
    }
  }
  */
})
