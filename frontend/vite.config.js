import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Only use a base in production builds
  base: process.env.NODE_ENV === 'production' ? '/triviaApp/' : '/',
  plugins: [react()],
});
