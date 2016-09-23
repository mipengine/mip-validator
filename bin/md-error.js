var ERR = require('../src/error.json');
var _ = require('lodash');

console.log('错误代码 | 错误消息 | 备注')
console.log('---      | ---      | ---')

_.map(ERR, (v, k) => {
    console.log(`${v.code} | ${v.message} | ${v.misc || '无'}`);
});

