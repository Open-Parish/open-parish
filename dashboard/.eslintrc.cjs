module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: ['eslint:recommended', 'airbnb', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts'],
      excludedFiles: ['**/*.types.ts'],
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
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
    'import/prefer-default-export': 'off',
    'import/order': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.*',
          '**/*.spec.*',
          '**/test/**',
          '**/tests/**',
          'cypress.config.ts',
          'cypress/**',
          'vite.config.*',
          'src/devtools/ReactQueryDevtools.tsx',
        ],
      },
    ],
    'import/no-unresolved': ['error', { ignore: ['\\.css$'] }],
    'no-nested-ternary': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',
    // Allow Mantine input components to spread form.getInputProps(...) without fighting the rule.
    // ESLint cannot scope this rule to a specific expression source (e.g. only getInputProps).
    'react/jsx-props-no-spreading': [
      'error',
      {
        exceptions: [
          'TextInput',
          'NumberInput',
          'Textarea',
          'Select',
          'MultiSelect',
          'PasswordInput',
          'Switch',
          'Checkbox',
          'Radio',
          'SettingsFormFooter',
        ],
      },
    ],
    'jsx-a11y/anchor-is-valid': 'error',
    'no-use-before-define': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
