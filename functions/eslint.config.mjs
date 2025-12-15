import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // Base configuration
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'lib/**/*', // Ignore built files
      'generated/**/*', // Ignore generated files
      'node_modules/**/*', // Ignore node_modules
      '**/*.js.map', // Ignore source maps
    ],
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'new-cap': 'off',
      camelcase: 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
];

