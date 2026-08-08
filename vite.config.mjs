import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/unit/setup.js',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    maxWorkers: 4,
    testTimeout: 10_000,
    slowTestThreshold: 1_000,
    coverage: {
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'test/**',
        'src/**/*.test.{js,jsx}',
        'src/**/*.spec.{js,jsx}',
        'src/api/lang/**',
      ],
      reporter: ['text', 'json-summary', 'html'],
      reportOnFailure: true,
      thresholds: {
        statements: 30,
        branches: 25,
        functions: 31,
        lines: 30,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'build',
  },

  // Converts absolute imports to relative paths
  resolve: {
    alias: {
      src: '/src',
    },
  },
})
