const ERR = require('../error.json')
const matcher = require('../matcher.js')

exports.onAttr = function (attr, attrRule, node, rule, error) {
  if (attrRule.disallow) {
    var err = ERR.DISALLOWED_ATTR
    var tagStr = matcher.fingerprintByObject(node.tagName)
    error(err, tagStr, attr.name)
  }
}
