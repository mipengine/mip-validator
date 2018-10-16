const _ = require('lodash')
const ERR = require('../error/dfn.json')

exports.onNode = function(node, rule, error) {
    if (!rule.ignore) return

    node.childNodes = []
}