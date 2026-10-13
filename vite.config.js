import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base を './' にしておくと、GitHub Pages のリポジトリ名に依存せず配信できます。
export default defineConfig({
  base: './',
  plugins: [react()],
});
