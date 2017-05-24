const ERR = require('../error.json')
const matcher = require('../matcher.js')

exports.onAttr = function (attr, attrRule, node, rule, error) {
  if (attrRule.value) {
    if (matcher.matchValue(attr.value, attrRule.value)) return

    var err = ERR.INVALID_ATTR_VALUE
    error(err, node.tagName, attr.name, attr.value)
  }
}
