import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    server: {
        port: 5173,
        proxy: {
            '/api': { // main backend in cloud
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/device-api': { // local backend for interacting with devices
                target: 'http://localhost:8081',
                changeOrigin: true,
            }
        }
    },

    preview: {
        port : 5174,
        proxy: {
            '/api': { // main backend in cloud
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/device-api': { // local backend for interacting with devices
                target: 'http://localhost:8081',
                changeOrigin: true,
            }
        }
    }
});
