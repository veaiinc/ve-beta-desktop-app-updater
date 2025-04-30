/* Generate by @shikijs/codegen */
import type {
	DynamicImportLanguageRegistration,
	DynamicImportThemeRegistration,
	HighlighterGeneric,
} from '@shikijs/types';
import { createSingletonShorthands, createdBundledHighlighter } from '@shikijs/core';
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript';

type BundledLanguage =
	| 'typescript'
	| 'ts'
	| 'javascript'
	| 'js'
	| 'vue'
	| 'python'
	| 'py'
	| 'java'
	| 'c'
	| 'cpp'
	| 'c++'
	| 'csharp'
	| 'c#'
	| 'cs'
	| 'ruby'
	| 'rb'
	| 'php'
	| 'go'
	| 'rust'
	| 'rs'
	| 'kotlin'
	| 'kt'
	| 'kts'
	| 'dart'
	| 'html'
	| 'css'
	| 'scss'
	| 'json'
	| 'yaml'
	| 'yml'
	| 'markdown'
	| 'md'
	| 'shellscript'
	| 'bash'
	| 'sh'
	| 'shell'
	| 'zsh'
	| 'powershell'
	| 'ps'
	| 'ps1'
	| 'sql'
	| 'lua'
	| 'perl'
	| 'xml'
	| 'ini'
	| 'properties'
	| 'toml';
type BundledTheme = 'light-plus' | 'dark-plus';
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

const bundledLanguages = {
	typescript: () => import('@shikijs/langs-precompiled/typescript'),
	ts: () => import('@shikijs/langs-precompiled/typescript'),
	javascript: () => import('@shikijs/langs-precompiled/javascript'),
	js: () => import('@shikijs/langs-precompiled/javascript'),
	vue: () => import('@shikijs/langs-precompiled/vue'),
	python: () => import('@shikijs/langs-precompiled/python'),
	py: () => import('@shikijs/langs-precompiled/python'),
	java: () => import('@shikijs/langs-precompiled/java'),
	c: () => import('@shikijs/langs-precompiled/c'),
	cpp: () => import('@shikijs/langs-precompiled/cpp'),
	'c++': () => import('@shikijs/langs-precompiled/cpp'),
	csharp: () => import('@shikijs/langs-precompiled/csharp'),
	'c#': () => import('@shikijs/langs-precompiled/csharp'),
	cs: () => import('@shikijs/langs-precompiled/csharp'),
	ruby: () => import('@shikijs/langs-precompiled/ruby'),
	rb: () => import('@shikijs/langs-precompiled/ruby'),
	php: () => import('@shikijs/langs-precompiled/php'),
	go: () => import('@shikijs/langs-precompiled/go'),
	rust: () => import('@shikijs/langs-precompiled/rust'),
	rs: () => import('@shikijs/langs-precompiled/rust'),
	kotlin: () => import('@shikijs/langs-precompiled/kotlin'),
	kt: () => import('@shikijs/langs-precompiled/kotlin'),
	kts: () => import('@shikijs/langs-precompiled/kotlin'),
	dart: () => import('@shikijs/langs-precompiled/dart'),
	html: () => import('@shikijs/langs-precompiled/html'),
	css: () => import('@shikijs/langs-precompiled/css'),
	scss: () => import('@shikijs/langs-precompiled/scss'),
	json: () => import('@shikijs/langs-precompiled/json'),
	yaml: () => import('@shikijs/langs-precompiled/yaml'),
	yml: () => import('@shikijs/langs-precompiled/yaml'),
	markdown: () => import('@shikijs/langs-precompiled/markdown'),
	md: () => import('@shikijs/langs-precompiled/markdown'),
	shellscript: () => import('@shikijs/langs-precompiled/shellscript'),
	bash: () => import('@shikijs/langs-precompiled/shellscript'),
	sh: () => import('@shikijs/langs-precompiled/shellscript'),
	shell: () => import('@shikijs/langs-precompiled/shellscript'),
	zsh: () => import('@shikijs/langs-precompiled/shellscript'),
	powershell: () => import('@shikijs/langs-precompiled/powershell'),
	ps: () => import('@shikijs/langs-precompiled/powershell'),
	ps1: () => import('@shikijs/langs-precompiled/powershell'),
	sql: () => import('@shikijs/langs-precompiled/sql'),
	lua: () => import('@shikijs/langs-precompiled/lua'),
	perl: () => import('@shikijs/langs-precompiled/perl'),
	xml: () => import('@shikijs/langs-precompiled/xml'),
	ini: () => import('@shikijs/langs-precompiled/ini'),
	properties: () => import('@shikijs/langs-precompiled/ini'),
	toml: () => import('@shikijs/langs-precompiled/toml'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>;

const bundledThemes = {
	'light-plus': () => import('@shikijs/themes/light-plus'),
	'dark-plus': () => import('@shikijs/themes/dark-plus'),
} as Record<BundledTheme, DynamicImportThemeRegistration>;

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<BundledLanguage, BundledTheme>({
	langs: bundledLanguages,
	themes: bundledThemes,
	engine: () => createJavaScriptRegexEngine(),
});

const {
	codeToHtml,
	codeToHast,
	codeToTokensBase,
	codeToTokens,
	codeToTokensWithThemes,
	getSingletonHighlighter,
	getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(createHighlighter);

export {
	bundledLanguages,
	bundledThemes,
	codeToHast,
	codeToHtml,
	codeToTokens,
	codeToTokensBase,
	codeToTokensWithThemes,
	createHighlighter,
	getLastGrammarState,
	getSingletonHighlighter,
};
export type { BundledLanguage, BundledTheme, Highlighter };
