const _ = require('lodash')
const ERR = require('../error.json')
const matcher = require('../matcher.js')
const POLYFILL_TAGS = ['html', 'body', 'head']
const logger = require('../logger.js')('mip-validator:mandatory_tag_missing')

// Tag 标记，Tag OR 标记
var tags, ors

exports.onBegin = function (error, engine) {
  logger.debug('[MANDATORY_TAG_MISSING] onBegin')
  tags = {}
  ors = {}

    // 初始化Mandatory标记
  _.forOwn(engine.config.nodes, (rules, ruleName) => {
    _.map(rules, rule => {
      if (rule.mandatory) {
        _.map(rule.mandatory, pattern => {
          var fp = matcher.fingerprintByObject(ruleName, pattern)
          tags[fp] = {
            rule: rule,
            ruleName: ruleName,
            pattern: pattern,
            count: 0
          }
        })
      }
      if (rule.mandatory_or) {
        ors[ruleName] = {
          rule: rule,
          ruleName: ruleName,
          count: 0
        }
      }
    })
  })

  validatePolyfill(error, engine)
}

exports.onNode = function (node, rule) {
  _.map(rule.mandatory, pattern => {
    if (!matcher.matchAttrs(node, pattern)) return

    var fp = matcher.fingerprintByObject(node.nodeName, pattern)
    tags[fp].count++
  })
  _.map(rule.mandatory_or, pattern => {
    if (!matcher.matchAttrs(node, pattern)) return
    ors[node.nodeName].count++
  })
}

exports.onEnd = function (error) {
  _.forOwn(tags, (v, k) => {
    if (v.rule.mandatory && v.count < 1) {
      error(ERR.MANDATORY_TAG_MISSING, k)
    }
  })
  _.forOwn(ors, (v, k) => {
    if (v.rule.mandatory_or && v.count < 1) {
      var fps = v.rule.mandatory_or
                .map(rule => matcher.fingerprintByObject(k, rule))
                .join("'或'")
      error(ERR.MANDATORY_TAG_MISSING, fps)
    }
  })
}

function validatePolyfill (error, engine) {
  POLYFILL_TAGS.forEach(tag => {
    var rules = _.get(engine.config.nodes, `${tag}`)
    _.map(rules, rule => {
      if (!rule.mandatory) return
      var matches = matcher.matchTagNames([tag], engine.html)
      if (matches.length === 0) {
        error(ERR.MANDATORY_TAG_MISSING, `<${tag}>`)
      }
    })
  })
}
