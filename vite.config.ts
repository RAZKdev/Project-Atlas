import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'exclude-uploads-from-dist',
      closeBundle() {
        const distUploads = path.resolve(__dirname, 'dist', 'uploads');
        if (fs.existsSync(distUploads)) {
          fs.rmSync(distUploads, { recursive: true, force: true });
        }
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
