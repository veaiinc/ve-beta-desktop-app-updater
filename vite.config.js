import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

export default defineConfig({
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				// No manual chunks - let Vite handle chunking automatically for speed
			},
		},
		chunkSizeWarningLimit: 2000,
		minify: 'esbuild',
		target: 'es2015',
		sourcemap: true,
		reportCompressedSize: false,
	},
	plugins: [
		react(),
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
							// ✅ Prevent collapsing variable font weights
							minifyFontValues: {
								removeAfterKeyword: false,
							},
						},
					],
				}),
			],
		},
	},
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'react-router-dom',
			'antd',
			'lodash',
			'axios',
			'moment',
			'dayjs',
			'@blocknote/core',
		],
		force: true,
	},
	server: {
		hmr: {
			overlay: false,
		},
	},
});
