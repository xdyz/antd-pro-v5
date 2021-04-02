const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  trailingComma: 'none',
  formatOnSave: true
};
