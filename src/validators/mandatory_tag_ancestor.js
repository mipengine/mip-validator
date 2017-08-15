const ERR = require('../error/dfn.json')

exports.onNode = function (node, rule, error) {
  if (!rule.mandatory_ancestor) return

  for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
    if (rule.mandatory_ancestor === cur.nodeName) {
      return
    }
  }
  var err = ERR.MANDATORY_TAG_ANCESTOR
  error(err, node.nodeName, rule.mandatory_ancestor)
}
