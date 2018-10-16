const _ = require('lodash')
const ERR = require('../error/dfn.json')
const matcher = require('../matcher.js')

var tagOccurrence

exports.onBegin = function(error, html, rules) {
    tagOccurrence = {}

    // 初始化Mandatory标记
    _.forOwn(rules, (subRules, ruleName) => {
        _.map(subRules, rule => {
            _.map(rule.attrs_or, pattern => {
                var fp = matcher.fingerprintByObject(ruleName, pattern)
                tagOccurrence[fp] = {
                    rule: rule,
                    ruleName: ruleName,
                    pattern: pattern,
                    count: 0
                }
            })
        })
    })
}

exports.onNode = function(node, rule, error) {
    if (!rule.attrs_or) return
    var attrOccurrence = _.keyBy(node.attrs, 'name')

    var matched = false
    _.map(rule.attrs_or, pattern => {
        var isExisted = true
        _.forOwn(pattern, (rules, attrName) => {
            if (!attrOccurrence[attrName]) {
                isExisted = false
            }
        })
        if (!isExisted || !matcher.matchAttrs(node, pattern)) return
        matched = true
    })
    if (!matched) {
        var fps = rule.attrs_or
            .map(rule => matcher.fingerprintByObject(node.nodeName, rule))
            .join("'或'")
        error(ERR.MANDATORY_ATTR_OR_MISSING, fps)
    }
}
