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
		// Custom plugin to copy wakeWord directory
		{
			name: 'copy-wake-word',
			// buildStart() {
			// 	const srcDir = 'electron/wakeWord';
			// 	const destDir = 'dist-electron/wakeWord';

			// 	if (existsSync(srcDir)) {
			// 		if (!existsSync(destDir)) {
			// 			mkdirSync(destDir, { recursive: true });
			// 		}

			// 		// Copy Python files
			// 		const files = [
			// 			'custom_hey_ve_detector.py',
			// 			'requirements.txt',
			// 			'hey_ve_ee.onnx',
			// 			'melspectrogram.onnx',
			// 			'embedding_model.onnx',
			// 		];
			// 		files.forEach((file) => {
			// 			const srcFile = join(srcDir, file);
			// 			const destFile = join(destDir, file);
			// 			if (existsSync(srcFile)) {
			// 				copyFileSync(srcFile, destFile);
			// 				console.log(`Copied ${file} to dist-electron/wakeWord/`);
			// 			}
			// 		});
			// 	}
			// },
			// writeBundle() {
			// 	const srcDir = 'electron/wakeWord';
			// 	const destDir = 'dist-electron/wakeWord';

			// 	if (existsSync(srcDir)) {
			// 		if (!existsSync(destDir)) {
			// 			mkdirSync(destDir, { recursive: true });
			// 		}

			// 		// Copy Python files
			// 		const files = [
			// 			'custom_hey_ve_detector.py',
			// 			'requirements.txt',
			// 			'hey_ve_ee.onnx',
			// 			'melspectrogram.onnx',
			// 			'embedding_model.onnx',
			// 		];
			// 		files.forEach((file) => {
			// 			const srcFile = join(srcDir, file);
			// 			const destFile = join(destDir, file);
			// 			if (existsSync(srcFile)) {
			// 				copyFileSync(srcFile, destFile);
			// 				console.log(`Copied ${file} to dist-electron/wakeWord/`);
			// 			}
			// 		});
			// 	}
			// },
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
								windowHelper: 'electron/helpers/windowHelper.js',
								galleryHelper: 'electron/galleryHelper.js',
								updateHelper: 'electron/updateHelper.js',
								overlayWindowHelper: 'electron/overlayWindowHelper.js',
								windowsCompatibility: 'electron/windowsCompatibility.js', // Add this line
								notchDropService: 'electron/services/notchDropService.js',
								notificationHelper: 'electron/notificationHelper.js',
								// wakeWordService: 'electron/wakeWordService.js',
							},
							output: {
								format: 'cjs',
								entryFileNames: (chunkInfo) => {
									if (chunkInfo.name === 'windowHelper') {
										return 'helpers/[name].js';
									}
									if (chunkInfo.name === 'notchDropService') {
										return 'services/[name].js';
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
				areYouThere: './areYouThere.html',
				dynamicIsland: './dynamic-island.html',
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
			'graphql',
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
