module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    'import/order': 'off',
    'import/prefer-default-export': 0,
    'no-console': 1,
    'react/jsx-sort-props': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
};
