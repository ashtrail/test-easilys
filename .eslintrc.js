module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-use-before-define': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    semi: ['warn', 'never'],
    quotes: ['warn', 'single', { avoidEscape: true }],
  },
}
