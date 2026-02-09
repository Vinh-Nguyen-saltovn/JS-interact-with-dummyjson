export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-const-assign': 'error',
      'no-unused-vars': 'warn',
      'no-redeclare': 'error',
    },
  },
]
