import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

export default defineConfig({
	build: {
		outDir: 'build', // Change output directory from 'dist' to 'build'
	},
	plugins: [
		react(),
		svgr({
			icon: true,
			svgo: true,
			svgoConfig: {
				plugins: [
					{
						name: 'removeDimensions',
						active: true,
					},
				],
			},
		}),
	],
	css: {
		devSourcemap: true,
	},
});
