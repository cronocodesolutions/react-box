const variables = require('./css.variables');

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-simple-vars': {
      silent: true,
      variables,
    },
    'postcss-each': {},
    'postcss-calc': {},
  },
};
