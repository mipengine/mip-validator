const _ = require('lodash')
const ERR = require('../error.json')
const POLYFILL_TAGS = ['html', 'body', 'head']
const matcher = require('../matcher.js')
const logger = require('../logger.js')('mip-validator:duplicate_unique_tag')

var cache

exports.onBegin = function (error, engine) {
  logger.debug('[DUPLICATE_UNIQUE_TAG] onBegin')
  cache = {}

  _.forOwn(engine.config.nodes, (rules, ruleName) => {
    _.map(rules, rule => {
      _.map(rule.duplicate, pattern => {
        var fingerprint = matcher.fingerprintByObject(ruleName, pattern)
        var hash = fingerprint + rule.id
        cache[hash] = 0
      })
    })
  })
  validatePolyfill(error, engine)
}

exports.onNode = function (node, rule, error) {
  if (!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return

  var duplicates = rule.duplicate

  _.map(duplicates, pattern => {
    if (!matcher.matchAttrs(node, pattern)) return

    var fingerprint = matcher.fingerprintByObject(node.nodeName, pattern)
    var hash = fingerprint + rule.id
    cache[hash]++
    if (cache[hash] <= 1) return

    error(ERR.DUPLICATE_UNIQUE_TAG, fingerprint)
  })
}

function validatePolyfill (error, engine) {
  POLYFILL_TAGS.forEach(tag => {
    var rules = _.get(engine.config.nodes, `${tag}`)
    _.map(rules, rule => {
      if (rule.duplicate.length === 0) return
      var matches = matcher.matchTagNames([tag], engine.html)
      if (matches.length > 1) {
        error(ERR.DUPLICATE_UNIQUE_TAG, tag)
      }
    })
  })
}
