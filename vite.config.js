import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				manualChunks: {
					// Vendor chunks
					vendor: ['react', 'react-dom', 'react-router-dom'],
					ui: ['antd', 'react-loading-skeleton', 'react-modal'],
					utils: ['lodash', 'moment', 'dayjs', 'axios'],
					// Feature chunks
					auth: ['js-cookie', 'jwt-decode'],
					forms: ['react-select', 'react-datepicker', 'react-phone-number-input'],
					media: ['react-player', 'react-dropzone', 'react-easy-crop'],
					charts: ['recharts'],
					editor: ['@blocknote/react', '@blocknote/core', '@blocknote/mantine'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
	plugins: [
		react(),
		splitVendorChunkPlugin(),
		svgr({
			svgoConfig: {
				plugins: [],
			},
		}),
	],
	css: {
		devSourcemap: true,
		postcss: {
			plugins: [
				require('autoprefixer'),
				require('cssnano')({
					preset: [
						'default',
						{
							discardComments: {
								removeAll: true,
							},
							normalizeWhitespace: true,
						},
					],
				}),
			],
		},
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
	},
	server: {
		hmr: {
			overlay: false,
		},
	},
});
