#!/usr/bin/env node

var ERR = require('../src/error/dfn.json')
var _ = require('lodash')

console.log('错误代码 | 错误标识 | 错误消息')
console.log('---      | ---      | ---')

_.map(ERR, (v, k) => {
  console.log(`${v.code} | \`${k}\` | ${v.message}`)
})

console.log('\n>该文件由 node bin/md-error.js 自动生成，请勿直接更改本文件。')
