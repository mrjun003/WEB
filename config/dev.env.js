'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  apiServer: 'http://192.168.8.152:8000',
  request_timeout: 12000,
})
