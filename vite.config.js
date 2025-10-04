import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import electron from 'vite-plugin-electron/simple';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// 🚀 LIGHTNING FAST: Ultimate Vite configuration for maximum speed
export default defineConfig({
	base: './',
	
	// 🚀 LIGHTNING FAST: Optimize dependencies for instant loading
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
			'electron'
		],
		exclude: ['@zubridge/electron'],
		force: true,
		esbuildOptions: {
			target: 'es2020',
		},
	},

	// 🚀 LIGHTNING FAST: Optimize dev server for instant HMR
	server: {
		port: 5173,
		host: true,
		hmr: {
			overlay: false, // Disable error overlay for better performance
			port: 5174,
		},
		watch: {
			usePolling: false, // Use native file watching for better performance
			interval: 1000,
		},
		fs: {
			strict: false, // Allow serving files from outside root
		},
	},

	// 🚀 LIGHTNING FAST: Optimize build for maximum speed
	build: {
		outDir: 'build',
		chunkSizeWarningLimit: 2000,
		minify: 'esbuild', // Fastest minifier
		target: 'es2020', // Modern target for better performance
		sourcemap: false, // Disable sourcemaps for faster builds
		reportCompressedSize: false, // Disable size reporting for speed
		emptyOutDir: true,
		
		// 🚀 LIGHTNING FAST: Optimize rollup options
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
			output: {
				// 🚀 LIGHTNING FAST: Optimize chunk splitting
				manualChunks: {
					vendor: ['react', 'react-dom'],
					ui: ['antd'],
					utils: ['lodash', 'axios', 'moment', 'dayjs'],
					graphql: ['graphql', '@apollo/client'],
				},
				// 🚀 LIGHTNING FAST: Optimize file naming
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
		},
		
		// 🚀 LIGHTNING FAST: Optimize esbuild options
		esbuild: {
			drop: ['console', 'debugger'], // Remove console logs in production
			target: 'es2020',
		},
	},

	// 🚀 LIGHTNING FAST: Optimize CSS processing
	css: {
		devSourcemap: false, // Disable CSS sourcemaps for speed
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
							minifyFontValues: {
								removeAfterKeyword: false,
							},
						},
					],
				}),
			],
		},
	},

	// 🚀 LIGHTNING FAST: Optimize plugins
	plugins: [
		react({
			// 🚀 LIGHTNING FAST: Optimize React plugin
			fastRefresh: true,
		}),
		svgr(),
		
		// 🚀 LIGHTNING FAST: Optimized asset copying
		{
			name: 'copy-assets-fast',
			buildStart() {
				const srcDir = 'electron/assets';
				const destDir = 'dist-electron/assets';

				if (existsSync(srcDir)) {
					if (!existsSync(destDir)) {
						mkdirSync(destDir, { recursive: true });
					}

					// 🚀 LIGHTNING FAST: Copy files in parallel
					const fs = require('fs');
					const files = fs.readdirSync(srcDir);
					
					// Use Promise.all for parallel copying
					Promise.all(
						files.map(file => {
							const srcFile = join(srcDir, file);
							const destFile = join(destDir, file);
							if (fs.statSync(srcFile).isFile()) {
								copyFileSync(srcFile, destFile);
								console.log(`✅ Copied ${file} to dist-electron/assets/`);
							}
						})
					);
				}
			},
		},
		
		// 🚀 LIGHTNING FAST: Optimized Electron plugin
		electron({
			main: {
				entry: 'electron/main',
				vite: {
					build: {
						outDir: 'dist-electron',
						emptyOutDir: false,
						copyPublicDir: false,
						minify: 'esbuild', // Fastest minifier
						sourcemap: false, // Disable sourcemaps for speed
						
						// 🚀 LIGHTNING FAST: Optimize rollup options
						rollupOptions: {
							external: [
								'electron',
								'electron-updater',
								'electron-log',
								'p-limit',
								'axios',
								'fs',
								'path',
								'os',
								'child_process',
								'worker_threads',
							],
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
									if (chunkInfo.name === 'notchDropService') {
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
						minify: 'esbuild', // Fastest minifier
						sourcemap: false, // Disable sourcemaps for speed
					},
				},
			},
		}),
	],

	// 🚀 LIGHTNING FAST: Optimize define for better performance
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		'process.env.VITE_DEV_SERVER_URL': JSON.stringify(process.env.VITE_DEV_SERVER_URL),
	},

	// 🚀 LIGHTNING FAST: Optimize resolve for faster module resolution
	resolve: {
		alias: {
			'@': '/src',
			'@components': '/src/components',
			'@views': '/src/views',
			'@hooks': '/src/hooks',
			'@utils': '/src/utils',
		},
	},
});