module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'off',
  },
};
