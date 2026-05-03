import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nodePlugin from 'eslint-plugin-n';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'temp/', '**/*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  nodePlugin.configs['flat/recommended'],
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'n/no-unpublished-import': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettierConfig,
);
