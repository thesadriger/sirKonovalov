// vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  // Если используете кастомную тему Ant Design через Less:
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Переменные теперь импортируются из antd.custom.less
        additionalData: `@import "${path.resolve(__dirname, 'src/styles/antd.custom.less')}";`
      }
    }
  },
  // При необходимости: alias для упрощения импортов
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@videos': path.resolve(__dirname, 'public/videos'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },
  // И другие опции...
}); 