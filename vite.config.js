import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import electron from 'vite-plugin-electron/simple';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export default defineConfig({
	base: './',
	plugins: [
		react(),
		svgr(),
		// Custom plugin to copy assets directory
		{
			name: 'copy-assets',
			buildStart() {
				const srcDir = 'electron/assets';
				const destDir = 'dist-electron/assets';

				if (existsSync(srcDir)) {
					if (!existsSync(destDir)) {
						mkdirSync(destDir, { recursive: true });
					}

					// Copy all files from assets directory
					const fs = require('fs');
					const files = fs.readdirSync(srcDir);
					files.forEach((file) => {
						const srcFile = join(srcDir, file);
						const destFile = join(destDir, file);
						if (fs.statSync(srcFile).isFile()) {
							copyFileSync(srcFile, destFile);
							console.log(`✅ Copied ${file} to dist-electron/assets/`);
						}
					});
				}
			},
		},
		electron({
			main: {
				entry: 'electron/main',
				vite: {
					build: {
						outDir: 'dist-electron',
						emptyOutDir: false,
						copyPublicDir: false,
						rollupOptions: {
							external: [],
						input: {
							main: 'electron/main',
							bridge: 'electron/bridge.js',
							store: 'electron/store.js',
							featuresIndex: 'electron/features/index.js',
							featuresMeetingIndex: 'electron/features/meeting/index.js',
							windowHelper: 'electron/helpers/windowHelper.js',
							galleryHelper: 'electron/galleryHelper.js',
							overlayWindowHelper: 'electron/overlayWindowHelper.js',
							windowsCompatibility: 'electron/windowsCompatibility.js',
							notchDropService: 'electron/services/notchDropService.js',
							ipcThrottleService: 'electron/services/ipcThrottleService.js',
							notificationHelper: 'electron/notificationHelper.js',
							dynamicIslandHelper: 'electron/helpers/dynamicIslandHelper.js',
							desktopUtilHelper: 'electron/desktopUtilHelper.js',
							autoUpdateHelper: 'electron/helpers/autoUpdateHelper.js',
						},
							output: {
								format: 'cjs',
							entryFileNames: (chunkInfo) => {
								if (
									chunkInfo.name === 'windowHelper' ||
									chunkInfo.name === 'dynamicIslandHelper' ||
									chunkInfo.name === 'autoUpdateHelper'
								) {
									return 'helpers/[name].js';
								}
								if (chunkInfo.name === 'notchDropService' || chunkInfo.name === 'ipcThrottleService') {
									return 'services/[name].js';
								}
								if (chunkInfo.name === 'featuresIndex') {
									return 'features/index.js';
								}
								if (chunkInfo.name === 'featuresMeetingIndex') {
									return 'features/meeting/index.js';
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
		target: 'es2020', // ⚡ Updated from es2015 for better performance
		sourcemap: process.env.NODE_ENV === 'production' ? false : true, // ⚡ Disable sourcemaps in production
		reportCompressedSize: false,
		rollupOptions: {
			input: {
				main: './index.html',
				overlay: './overlay.html',
				askAI: './askAI.html',
				areYouThere: './areYouThere.html',
				dynamicIsland: './dynamic-island.html',
				permission: './permission.html',
				errorFallback: './error-fallback.html',
			},
			// ✅ REVERTED: Removed aggressive code splitting that broke production
			// Keeping default Vite chunking strategy (safe and proven)
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
			'graphql',
		],
		// ⚡ PERFORMANCE FIX: Exclude large dependencies that don't need pre-bundling
		exclude: ['notchdrop-addon'],
	},

	server: {
		hmr: {
			overlay: false,
		},
		// ⚡ PERFORMANCE FIX: Faster HMR and better caching
		watch: {
			ignored: ['**/node_modules/**', '**/dist/**', '**/dist-electron/**', '**/build/**'],
		},
		// Improve dev server performance
		fs: {
			strict: false,
		},
	},

	// ⚡ PERFORMANCE FIX: Enable esbuild optimization for dependencies
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
		drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
	},

	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	},
});
