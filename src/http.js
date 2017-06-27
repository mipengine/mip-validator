const Validator = require('..')
const url = require('url')
const http = require('http')
const usage = [
  'Usage:',
  '    GET / for help',
  '    POST /validate with HTML body to validate',
  '    POST /validate?fast=true with HTML body to fast validate'
].join('\n')

function mkServer (rules) {
  var validator = rules ? Validator(rules) : Validator()
  var routes = {}
  var server = mkRouter(routes)

  routes['/'] = function (req, res) {
    res.end(usage)
  }

  routes['/validate'] = function (req, res) {
    var fastMode = (req.params.fast === 'true')
    var result = validator.validate(req.body, {fastMode: fastMode})
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result, null, 4))
  }

  return server
}

function mkRouter (routes) {
  return http.createServer((req, res) => {
    var data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      var urlObj = url.parse(req.url, true)
      var route = routes[urlObj.pathname]
      if (!route) {
        res.statusCode = 404
        return res.end()
      }
      req.params = urlObj.query
      req.body = data
      route(req, res)
    })
  })
}

module.exports = mkServer
