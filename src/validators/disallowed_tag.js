const _ = require('lodash')
const ERR = require('../error/dfn.json')
const POLYFILL_TAGS = ['frame', 'frameset']
const matcher = require('../matcher.js')
const logger = require('../logger.js')('mip-validator:disallowed_tag')

exports.onBegin = function (error, html, rules) {
  validatePolyfill(error, html, rules)
}

exports.onNode = function (node, rule, error) {
  if (!rule.disallow || _.includes(POLYFILL_TAGS, node.nodeName)) return
  var err = ERR.DISALLOWED_TAG
  error(err, matcher.fingerprintByTag(node))
}

// parse5 do not support frameset/frame
// ref: https://github.com/inikulin/parse5/issues/6
function validatePolyfill (error, html, rules) {
  var matches = matcher.matchTagNames(POLYFILL_TAGS, html)
  matches.forEach(function (tag) {
    var tagName = tag.match(/\w+/)
    if (tagName) {
      var subRules = _.get(rules, tagName[0])
    }
    _.map(subRules, rule => {
      if (!rule.disallow) {
        return
      }

      var err = ERR.DISALLOWED_TAG
      error(err, tag)
    })
  })
}
