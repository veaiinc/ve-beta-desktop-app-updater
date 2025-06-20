import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				// Manual chunks removed - will use default chunking behavior
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
