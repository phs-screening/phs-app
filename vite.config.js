import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    clearMocks: true,
    coverage: {
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{js,jsx}',
        'src/**/*.spec.{js,jsx}',
        'src/api/lang/**',
      ],
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000',
    }
  },
  build: {
    outDir: 'build'
  },

  // Converts absolute imports to relative paths
  resolve: {
    alias: {
      'src': '/src'
    }
  }
})
