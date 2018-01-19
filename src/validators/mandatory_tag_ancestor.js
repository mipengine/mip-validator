const ERR = require('../error/dfn.json')
const matcher = require('../matcher.js')

exports.onNode = function(node, rule, error) {
    if (!rule.mandatory_ancestor) return

    for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
        if (matcher.matchValue(cur.nodeName, rule.mandatory_ancestor)) {
            return
        }
    }
    var err = ERR.MANDATORY_TAG_ANCESTOR
    error(err, node.nodeName, rule.mandatory_ancestor)
}