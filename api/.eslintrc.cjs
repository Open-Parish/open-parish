module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['**/*.types.ts', '**/*.d.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['**/*.ts'],
      excludedFiles: ['**/*.types.ts', '**/*.d.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TSInterfaceDeclaration',
            message: 'Move interface declarations to a separate .ts file.',
          },
          {
            selector: 'TSTypeAliasDeclaration',
            message: 'Move type alias declarations to a separate .ts file.',
          },
        ],
      },
    },
  ],
};
