import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Don't generate HTML file
    manifest: false,
    cssCodeSplit: false,
    minify: 'terser',
    rollupOptions: {
      input: resolve(__dirname, 'assets/js/content.js'),
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Don't hash the manifest.json file
          if (assetInfo.name === 'manifest.json') {
            return '[name][extname]';
          }
          // Put images in the images directory
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
            return 'images/[name][extname]';
          }
          // Put CSS in the css directory
          if (assetInfo.name && /\.css$/.test(assetInfo.name)) {
            return 'css/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets')
    }
  }
});
