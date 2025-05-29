import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

function makeWarn(rules) {
	const warnedRules = {};
	for (const [rule, setting] of Object.entries(rules || {})) {
		// If rule is off, keep off; else set to 'warn'
		warnedRules[rule] = setting === 'off' || setting === 0 ? 'off' : 'warn';
	}
	return warnedRules;
}

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginReact.configs.flat.recommended,
	{
		files: ['**/*.{js,jsx}'],
		rules: {
			'react/react-in-jsx-scope': 'off', // keep off, fine for React 18
			'react/prop-types': 'off', // optional, off to skip prop-types checking

			'no-dupe-keys': 'warn',
			'no-undef': 'warn',
			'no-unused-expressions': 'warn',
			'no-constant-condition': 'warn',
			'no-duplicate-imports': 'warn',
			'no-useless-escape': 'warn',
			'no-useless-rename': 'warn',
			'no-duplicate-case': 'warn',
			'no-unreachable-loop': 'warn',
			'no-unsafe-optional-chaining': 'warn',
			'no-unsafe-negation': 'warn',
			'no-unsafe-finally': 'warn',
			'no-unsafe-optional-chaining': 'warn',
			'no-unused-vars': 'off',
			'no-case-declarations': 'off',
			'react/no-unescaped-entities': 0,
			'react/jsx-key': 'off',
			'no-empty': 'off',
			'no-constant-binary-expression': 'off',
			'react/display-name': 'warn',
			'react/no-deprecated': 'warn',
			'no-prototype-builtins': 'off',
			'no-irregular-whitespace': 'warn',
			'react/no-children-prop': 'warn',
			'react/no-unknown-property': 'warn',
		},
		settings: {
			react: {
				version: '18.3.1',
			},
		},
	},
	// Final override: make all rules warnings instead of errors
	{
		rules: makeWarn({
			// merge all rules from js.recommended and react flat recommended here if you want
			// or leave empty if you want to warn only overridden rules above
		}),
	},
]);
