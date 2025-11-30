import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // Copy manifest and update paths
        const manifestPath = 'manifest.json';
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        
        // Update paths for built files
        manifest.background.service_worker = 'background/service-worker.js';
        // Remove default_popup if it exists (we're using onClicked instead)
        // This is critical - if default_popup exists, onClicked won't fire
        if (manifest.action) {
          delete manifest.action.default_popup;
        } else {
          manifest.action = {};
        }
        
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }
        if (!existsSync('dist/background')) {
          mkdirSync('dist/background', { recursive: true });
        }
        if (!existsSync('dist/public')) {
          mkdirSync('dist/public', { recursive: true });
        }
        if (!existsSync('dist/public/icons')) {
          mkdirSync('dist/public/icons', { recursive: true });
        }
        
        writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
        
        // Copy and fix HTML files - move to root and fix absolute paths
        const htmlFiles = [
          { src: 'dist/src/manager/manager.html', dest: 'dist/manager.html' }
        ];
        
        for (const { src, dest } of htmlFiles) {
          if (existsSync(src)) {
            let htmlContent = readFileSync(src, 'utf-8');
            // Fix absolute paths to relative paths for Chrome extension
            htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
            htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
            writeFileSync(dest, htmlContent);
          }
        }
        
        // Copy icons if they exist
        try {
          if (existsSync('public/icons/icon16.png')) {
            copyFileSync('public/icons/icon16.png', 'dist/public/icons/icon16.png');
          }
          if (existsSync('public/icons/icon48.png')) {
            copyFileSync('public/icons/icon48.png', 'dist/public/icons/icon48.png');
          }
          if (existsSync('public/icons/icon128.png')) {
            copyFileSync('public/icons/icon128.png', 'dist/public/icons/icon128.png');
          }
        } catch (e) {
          console.warn('Icons not found, skipping copy. Add icon files to public/icons/ before building.');
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        manager: resolve(__dirname, 'src/manager/manager.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'background/service-worker.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.html')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});

