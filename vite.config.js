import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	build: {
		outDir: 'build',
		chunkSizeWarningLimit: 2000,
		minify: 'esbuild',
		target: 'es2015',
		sourcemap: true,
		reportCompressedSize: false,
	},
	plugins: [
		react(),
		visualizer({
			open: true,
			filename: 'bundle-visualizer.html',
			brotliSize: true,
		}),
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
