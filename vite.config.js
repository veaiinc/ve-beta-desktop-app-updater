// vite.config.js
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
						emptyOutDir: false
					}
				}
			},
			preload: {
				input: 'electron/preload',
				vite: {
					build: {
						outDir: 'dist-electron',
						emptyOutDir: false
					}
				}
			}
		})
	],

	build: {
		outDir: 'build',
		chunkSizeWarningLimit: 2000,
		minify: 'esbuild',
		target: 'es2015',
		sourcemap: true,
		reportCompressedSize: false,
		chunkLoading: 'import',
		modulePreload: false
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
							discardComments: { removeAll: true },
							normalizeWhitespace: true,
							minifyFontValues: { removeAfterKeyword: false }
						}
					]
				})
			]
		}
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
			'dayjs'
		],
		// Don’t pre-bundle the native watcher module
		exclude: ['@parcel/watcher'],
		force: true
	},

	server: {
		hmr: {
			overlay: false
		}
	},

	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}
});
