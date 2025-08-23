import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
	base: './',
	plugins: [
		react(),
		svgr(),
		electron({
			main: {
				entry: 'electron/main',
				vite: {
					build: {
						outDir: 'dist-electron',
						emptyOutDir: false,
						rollupOptions: {
							external: [],
							input: {
								main: 'electron/main',
								windowHelper: 'electron/helpers/windowHelper.js',
								galleryHelper: 'electron/galleryHelper.js',
								updateHelper: 'electron/updateHelper.js',
								overlayWindowHelper: 'electron/overlayWindowHelper.js',
							},
							output: {
								format: 'cjs',
								entryFileNames: (chunkInfo) => {
									if (chunkInfo.name === 'windowHelper') {
										return 'helpers/[name].js';
									}
									return '[name].js';
								},
							},
						},
					},
				},
			},
			preload: {
				input: 'electron/preload',
				vite: {
					build: {
						outDir: 'dist-electron',
						emptyOutDir: false,
					},
				},
			},
		}),
	],

	build: {
		outDir: 'build',
		chunkSizeWarningLimit: 2000,
		minify: 'esbuild',
		target: 'es2015',
		sourcemap: true,
		reportCompressedSize: false,
		rollupOptions: {
			input: {
				main: './index.html',
				overlay: './overlay.html',
				askAI: './askAI.html',
			},
		},
	},
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

	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	},
});
