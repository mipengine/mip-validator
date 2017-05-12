#! /usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const Validator = require('..')
const path = require('path')
const http = require('http')
const url = require('url')

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
var validator = config ? Validator(config) : Validator()

/// /////////////////////////////////////////////////////////////////
// Initialize Server
var routes = {}
const server = http.createServer((req, res) => {
  var data = ''
  req.on('data', (chunk) => {
    data += chunk
  })
  req.on('end', () => {
    var urlObj = url.parse(req.url, true)
    var route = routes[urlObj.pathname]
    if (!route) {
      res.statusCode = 404
      res.end()
    }
    req.params = urlObj.query
    req.body = data
    route(req, res)
  })
})

/*
 * Router: /
 */
var usage = [
  'Usage:',
  '    GET / for help',
  '    POST /validate with HTML body to validate',
  '    POST /validate?fast=true with HTML body to fast validate'
].join('\n')
routes['/'] = function (req, res) {
  res.end(usage)
}

/*
 * Router: /validate
 */
routes['/validate'] = function (req, res) {
  var fastMode = (req.params.fast === 'true')
  var result = validator.validate(req.body, fastMode)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result, null, 4))
}

/// ///////////////////////////////////////////////////////////////
// Return Server
server.listen(program['port'], program['host'], function () {
  console.log(`[http] listening to ${program['host']}:${program['port']}`)
})

module.exports = server
