exports.onNode = function(node, rule) {
    if (!rule.ignore) return
    node.childNodes = []
}
