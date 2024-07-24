import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    host: true,

  },
});
