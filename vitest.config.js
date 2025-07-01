import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.js', './src/tests/setup.js'],
		globals: true,
		css: true,
		// Additional test configuration
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/setupTests.js',
				'src/tests/setup.js',
				'**/*.d.ts',
				'**/*.config.js',
				'**/*.config.ts',
			],
		},
	},
});
