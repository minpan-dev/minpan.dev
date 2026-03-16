import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import type { Config } from 'typescript-eslint';

const config: Config = [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  { rules: { 'no-console': 'error' } },
  { ignores: ['dist/**', '.astro'] },
];

export default config;
