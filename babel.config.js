/* eslint-disable no-undef */
// global`module` is undefined
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
}
