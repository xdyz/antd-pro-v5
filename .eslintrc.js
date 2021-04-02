module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-param-reassign': 0,
    semi: [2, 'never'],
    'comma-dangle': ['error', 'only-multiline'],
    'global-require': 0,
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off'
  }
}
