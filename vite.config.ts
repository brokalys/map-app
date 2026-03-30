import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitest/config';
import zipPack from 'vite-plugin-zip-pack';

import packageJson from './package.json';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'chrome-extension-manifest',
      writeBundle(options, bundle) {
        const outDir = options.dir || 'build';
        const jsFiles = Object.keys(bundle)
          .filter(
            (key) =>
              bundle[key].type === 'chunk' &&
              (bundle[key] as { isEntry?: boolean }).isEntry,
          )
          .map((key) => key);

        const manifest = {
          manifest_version: 3,
          name: 'Brokalys: ss.lv historical prices',
          description: packageJson.description,
          homepage_url: 'https://brokalys.com',
          version: packageJson.version,
          icons: {
            '512': 'favicon.png',
          },
          action: {
            default_icon: 'favicon.png',
          },
          content_scripts: [
            {
              matches: [
                'https://www.ss.lv/msg/*/real-estate/*',
                'https://www.ss.com/msg/*/real-estate/*',
              ],
              js: jsFiles,
              run_at: 'document_idle',
            },
          ],
          author: packageJson.author,
        };

        fs.writeFileSync(
          path.resolve(outDir, 'manifest.json'),
          JSON.stringify(manifest, null, 2),
        );
      },
    },
    zipPack({
      inDir: 'build',
      outDir: 'build',
      outFileName: 'extension.zip',
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        entryFileNames: 'js/bundle.js',
        assetFileNames: 'assets/[name].[ext]',
        inlineDynamicImports: true,
      },
    },
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    passWithNoTests: true,
  },
});
