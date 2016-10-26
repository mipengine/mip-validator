#! /usr/bin/env node

/*
 * 使用前请先启动服务器，默认主机与端口为127.0.0.1:4445
 * $ node bin/socket.js
 * 然后运行本Demo：
 * $ node demo/socket.js
 */

const net = require('net');
const HOST = '127.0.0.1';
const PORT = '4445';
const DELEM = '__baidu_mip_validator__';

var client = new net.Socket();

client.setEncoding('utf8');

// 连接到socket服务器
// 连接成功后立即发送两个HTML文档
client.connect(PORT, HOST, function() {
    client.write('<html></html>' + DELEM);
    client.write('<html><head></head><body></body></html>' + DELEM);
});

// 等待处理的校验结果字符串
var resultsStr = '';
var arrivedResultsCount = 0;

// 有数据到来时，处理现有数据
client.on('data', function(data) {
    resultsStr += data;

    // 取出已经完整的数据，作为校验结果数组
    var results = resultsStr.split(DELEM);
    // 剩余的不完整数据
    resultsStr = results.pop();

    // 遍历所有已到达的结果
    results.forEach(function(result){
        console.log(`validation result for ${arrivedResultsCount}`);
        console.log(result);

        // 如果两个HTML均已到达，则关闭socket
        if(++arrivedResultsCount === 2){
            console.log('all results arrived, destroying client');
            client.destroy();
        }
    });
});

