#! /usr/bin/env node

/*
 * 使用前请先启动服务器，默认主机与端口为127.0.0.1:4445
 * $ node bin/http.js
 * 然后运行本Demo：
 * $ node demo/http.js
 */

const http = require('http');
const HOST = '127.0.0.1';
const PORT = '4444';

// 发送HTTP请求
var req = http.request({
        host: HOST,
        port: PORT,
        path: '/validate',
        method: 'POST'
    },
    function(res) {
        var result = '';
        // 有数据到来时，追加到result字符串
        res.on('data', x => result += x);
        // 结束时，输出校验结果
        res.on('end', function() {
            console.log('normal validation:');
            console.log(result);
        });
    });
req.end('<html></html>');


// 发送HTTP请求
req = http.request({
        host: HOST,
        port: PORT,
        // 开启快速校验选项
        path: '/validate?fast=true',
        method: 'POST'
    },
    function(res) {
        var result = '';
        res.on('data', x => result += x);
        res.on('end', function() {
            console.log('fast validation:');
            console.log(result);
        });
    });
req.end('<html></html>');
