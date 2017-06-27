#! /usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const path = require('path')
const mkServer = require('../src/http')

/// /////////////////////////////////////////////////////////////////
// Initialize CLI
program
    .version(pkg.version)
    .option('-H, --host [host]', 'host to bind [127.0.0.1]', '127.0.0.1')
    .option('-p, --port [port]', 'port to bind [4444]', '4444')
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')

program.on('--help', function () {
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

var server = mkServer(config)
server.listen(program['port'], program['host'], function () {
  console.log(`[http] listening to ${program['host']}:${program['port']}`)
})
