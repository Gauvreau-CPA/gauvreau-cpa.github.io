// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

// Vite plugin: serve index.html for directory paths in dev (GitHub Pages compatibility)
function directoryIndexPlugin() {
  return {
    name: 'directory-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const filePath = join(process.cwd(), 'public', url);
        if (existsSync(filePath) && statSync(filePath).isDirectory()) {
          const indexPath = join(filePath, 'index.html');
          if (existsSync(indexPath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(readFileSync(indexPath));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://gauvreau-cpa.github.io',
  vite: {
    plugins: [directoryIndexPlugin()]
  }
});
