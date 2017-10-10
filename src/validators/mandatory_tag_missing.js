const _ = require('lodash')
const ERR = require('../error/dfn.json')
const matcher = require('../matcher.js')
const POLYFILL_TAGS = ['html', 'body', 'head']
const logger = require('../logger.js')('mip-validator:mandatory_tag_missing')

var tagOccurrence, anyTagOccurrence

exports.onBegin = function(error, html, rules) {
    logger.debug('[MANDATORY_TAG_MISSING] onBegin')
    tagOccurrence = {}
    anyTagOccurrence = {}

    // 初始化Mandatory标记
    _.forOwn(rules, (subRules, ruleName) => {
        _.map(subRules, rule => {
            _.map(rule.mandatory, pattern => {
                var fp = matcher.fingerprintByObject(ruleName, pattern)
                tagOccurrence[fp] = {
                    rule: rule,
                    ruleName: ruleName,
                    pattern: pattern,
                    count: 0
                }
            })
            if (rule.mandatory_or) {
                anyTagOccurrence[ruleName] = {
                    rule: rule,
                    ruleName: ruleName,
                    count: 0
                }
            }
        })
    })

    validatePolyfill(error, html, rules)
}

exports.onNode = function(node, rule) {
    _.map(rule.mandatory, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return

        var fp = matcher.fingerprintByObject(node.nodeName, pattern)
        tagOccurrence[fp].count++
    })
    _.map(rule.mandatory_or, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return
        anyTagOccurrence[node.nodeName].count++
    })
}

exports.onEnd = function(error) {
    _.forOwn(tagOccurrence, (v, k) => {
        if (v.rule.mandatory && v.count < 1) {
            error(ERR.MANDATORY_TAG_MISSING, k)
        }
    })
    _.forOwn(anyTagOccurrence, (v, k) => {
        if (v.rule.mandatory_or && v.count < 1) {
            var fps = v.rule.mandatory_or
                .map(rule => matcher.fingerprintByObject(k, rule))
                .join("'或'")
            error(ERR.MANDATORY_TAG_MISSING, fps)
        }
    })
}

function validatePolyfill(error, html, rules) {
    POLYFILL_TAGS.forEach(tag => {
        var subRules = _.get(rules, `${tag}`)
        _.map(subRules, rule => {
            if (rule.mandatory.length === 0) {
                return
            }
            var matches = matcher.matchTagNames([tag], html)
            if (matches.length === 0) {
                error(ERR.MANDATORY_TAG_MISSING, `<${tag}>`)
            }
        })
    })
}