#! /usr/bin/env node

const net = require('net')
const program = require('commander')
const _ = require('lodash')
const pkg = require('../package.json')
const Validator = require('..')
const path = require('path')
const fs = require('fs')
const http = require('http')
const httpServer = require('./http.js')
const socketServer = require('./socket.js')
const HTML_COUNT = 512

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [validator.json]')
    .parse(process.argv)

var rules
if (program['conf']) {
  var configPath = path.resolve(process.cwd(), program['conf'])
  rules = require(configPath)
}

var htmls = readHTMLFiles(path.resolve(__dirname, '../cases'))
htmls = randomize(htmls, HTML_COUNT)

var bm = Benchmark(htmls.length)
Promise.resolve()
  .then(() => npmBenchmark(false))
  .then(() => npmBenchmark(true))
  .then(() => httpBenchmark(false))
  .then(() => httpBenchmark(true))
  .then(socketBenchmark)
  .then(() => {
    bm.finish()
    httpServer.close()
    socketServer.close()
  })
  .catch(e => {
    console.error(e)
    httpServer.close()
    socketServer.close()
  })

function npmBenchmark (fast) {
  var validator = Validator(rules, {
    fast: fast
  })
  bm.begin('NPM', fast)
  htmls.forEach(html => validator.validate(html))
  bm.end('NPM', fast)
  return Promise.resolve()
}

function httpBenchmark (fast) {
  return new Promise(function (resolve) {
    bm.begin('HTTP', fast)
    var httpRequestOptions = {
      host: '127.0.0.1',
      port: '4444',
      path: '/validate?fast=' + fast,
      method: 'POST'
    }
    var httpRequestCount = htmls.length
    var failCount = 0

    function onRequest (res) {
      res.on('data', x => x)
      res.on('end', onEnd)
    };

    function onEnd () {
      httpRequestCount--
      if (httpRequestCount === 0) {
        console.log(`[benchmark] HTTP fail count: ${failCount}`)
        bm.end('HTTP', fast, -failCount)
        resolve()
      }
    }

    function onFail () {
      failCount++
      onEnd()
    }

    htmls.forEach(html => {
      var req = http.request(httpRequestOptions, onRequest)
      req.on('error', onFail)
      req.end(html)
    })
  })
}

function socketBenchmark () {
  return new Promise(function (resolve, reject) {
    bm.begin('Socket', true)
    var client = new net.Socket()
    var successCount = 0
    const DELEM = '__baidu_mip_validator__'

    client.setEncoding('utf8')
    client.connect('4445', '127.0.0.1', function () {
      htmls.forEach(html => {
        client.write(html + DELEM)
      })
    })

    var result = ''
    client.on('data', function (data) {
      result += data
      var tokens = result.split(DELEM)
      result = tokens.pop()
      tokens.forEach(() => successCount++)
      if (successCount === HTML_COUNT) {
        resolve()
        bm.end('Socket', true)
        client.destroy()
      }
    })

    client.on('error', reject)

    client.on('close', function () {
      var msg = '[benchmark] Connection closed'
      console.log(msg)
      reject(new Error(msg))
    })
  })
}

/*
 * A nice benchmark tool
 */
function Benchmark (count) {
  var beginTime = {}
  var columnWidth = [10, 8, 13, 9, 13, 13]
  var totalWidth = columnWidth.reduce((prev, cur) => prev + cur, 0)
  const BANNER = '-'.repeat(totalWidth + 1)

  var logs = [BANNER]
  logs.push(
    '|' +
    render('API', 0) +
    render('Mode', 1) +
    render('Time(ms)', 2) +
    render('Count', 3) +
    render('doc/s', 4) +
    render('doc/day', 5))
  logs.push(BANNER)

  function begin (label, mode) {
    var title = label + (mode ? '(fast)' : '(normal)')
    console.time(`benchmarking ${title}`)
    beginTime[title] = Date.now()
  }

  /*
   * @param {Boolean} mode is fast mode enabled
   * @param {Number} coutnOffset count offset, in case failures
   */
  function end (label, mode, countOffset) {
    var title = label + (mode ? '(fast)' : '(normal)')
    console.timeEnd(`benchmarking ${title}`)
    countOffset = countOffset || 0
    var actualCount = count + countOffset
    var time = (Date.now() - beginTime[title]).toExponential(3)
    var perSec = (actualCount * 1000 / time).toExponential(3)
    var perDay = (actualCount * 1000 * 3600 * 24 / time).toExponential(3)
    logs.push(
      '|' +
      render(label, 0) +
      render(mode ? 'fast' : 'normal', 1) +
      render(time, 2) +
      render(actualCount, 3) +
      render(perSec, 4) +
      render(perDay, 5))
  }

  function render (str, n) {
    var width = columnWidth[n]
    str = str + ''
    var paddingLength = width - str.length - 2
    if (paddingLength < 0) {
      var msg = 'min width for column ' + n +
        ' is ' + (width - paddingLength)
      throw new Error(msg)
    }
    var renderding = ' '.repeat(paddingLength)
    return renderding + str + ' |'
  }

  function finish () {
    logs.push(BANNER)
    console.log(logs.join('\n'))
  }

  return {
    begin,
    end,
    finish
  }
}

/*
 * Generate an array containing `size` random items from `seeds`.
 */
function randomize (seeds, size) {
  console.log('[benchmark] generating randomized html files of size:', size)
  var ret = []
  while (size--) {
    var i = _.random(0, seeds.length - 1)
    ret.push(seeds[i])
  }
  return ret
}

function readHTMLFiles (filepath) {
  console.time('reading html files')
  var htmlFiles = fs.readdirSync(filepath)

  var files = htmlFiles
    .filter(file => file.match(/\.html$/))
  console.log(`[benchmark] found ${files.length} html files in ${filepath}`)

  var htmlContents = files
    .map(file => path.resolve(filepath, file))
    .map(filepath => fs.readFileSync(filepath, 'utf8'))
  console.timeEnd('reading html files')
  return htmlContents
}
