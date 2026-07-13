import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PENTING: ganti 'carousel-demo' dengan nama repo GitHub kamu.
// Kalau repo-nya user page (nama repo persis "username.github.io"), ganti base jadi '/'.
export default defineConfig({
  plugins: [react()],
  base: '/carousel-demo/'
});
