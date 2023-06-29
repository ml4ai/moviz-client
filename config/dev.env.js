'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  publicPath: process.env.NODE_ENV === 'production'
      ? '/moviz-client/' // your-repo-name 替换为你的 Github 仓库名称
      : '/'
})
