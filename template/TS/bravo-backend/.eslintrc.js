module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: ['prettier', 'prettier/react', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  overrides: [
    {
      files: '**/*.ts?(x)',
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'prettier',
        'prettier/react',
        'plugin:react/recommended',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'react/prop-types': 0,
        'react/display-name': 0,
      },
    },
  ],
  rules: {
    'import/no-unresolved': 0,
    // 'no-console': ['error', { allow: ['warn', 'error'] }],
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/no-explicit-any': 'error',
    // 'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    // 'react/jsx-props-no-spreading': 0,
    // 'operator-assignment': 0,
    // 'react/no-did-update-set-state': 0,
    // 'consistent-return': 0,
    // 'react/sort-comp': 0,
    // 'no-plusplus': 'off', // i++
    // 'radix': 'off', // parseInt Missing radix parameter
    // 'no-restricted-properties': 'off', // Math.pow(10, 2) === 10**2
    // 'import/order': 0,
    // '@typescript-eslint/explicit-member-accessibility': 0,
    // '@typescript-eslint/no-non-null-assertion': 0,
    // 'no-param-reassign': 0,
    // '@typescript-eslint/no-object-literal-type-assertion': 0,
  },
}
