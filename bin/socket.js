#! /usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const Validator = require('..')
const path = require('path')
const net = require('net')

/// /////////////////////////////////////////////////////////////////
// Initialize CLI
program
    .version(pkg.version)
    .option('-H, --host [host]', 'host to bind [127.0.0.1]', '127.0.0.1')
    .option('-p, --port [port]', 'port to bind [4445]', '4445')
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')

program.on('--help', function() {
    console.log('  Examples:')
    console.log('')
    console.log('    $ node bin/http.js -H 0.0.0.0 -p 8888')
    console.log('')
})

program.parse(process.argv)

/// /////////////////////////////////////////////////////////////////
// Initialize Validator
var config = null
if (program['conf']) {
    var configPath = path.resolve(process.cwd(), program['conf'])
    config = require(configPath)
}
var validator = Validator(config, {
    fast: true
})

const DELEM = '__baidu_mip_validator__'
    // TODO 使用 Stream 代替 String
const server = net.createServer((sock) => {
    console.log('[socket] CONNECTED:', sock.remoteAddress, +sock.remotePort)

    var str = ''
    sock.on('data', function(data) {
        str += data
        var tokens = str.split(DELEM)
        str = tokens.pop()
        tokens.forEach(function(html) {
            var result = validator.validate(html)
            sock.write(JSON.stringify(result, null, 4) + DELEM)
        })
    })
    sock.on('close', function() {
        console.log('[socket] CLOSED:', sock.remoteAddress, sock.remotePort)
    })
})

server.listen(program['port'], program['host'], () => {
    console.log(`[socket] bound to ${program['host']}:${program['port']}`)
})

module.exports = server