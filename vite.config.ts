import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

type ViteConfigProps = {
  mode: string;
  command: string;
};
// https://vite.dev/config/
export default ({ mode }: ViteConfigProps) => {
  const generateScopedName =
    mode === 'production'
      ? '[hash:base64:5]'
      : '[local]__[hash:base64:5]';
  return defineConfig({
    assetsInclude: [
      '**/*.JPG',
      '**/*.webp',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.png',
      '**/*.svg',
    ],
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@server': path.resolve(__dirname, '../server/src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName,
      },
    },
  });
};
