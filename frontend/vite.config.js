import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function customUrlLoggerPlugin() {
  return {
    name: 'custom-url-logger',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          console.log('\n  \x1b[36m\x1b[1m➜  Trang Khách Hàng (Customer):\x1b[0m       \x1b[32mhttp://localhost:3000/\x1b[0m');
          console.log('  \x1b[35m\x1b[1m➜  Trang Quản Trị & Nhân Viên (Admin):\x1b[0m \x1b[33mhttp://localhost:3000/admin\x1b[0m\n');
        }, 150);
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), customUrlLoggerPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.BACKEND_PROXY_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
