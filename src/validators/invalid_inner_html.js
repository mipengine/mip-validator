const ERR = require('../error/dfn.json')
const matcher = require('../matcher.js')

exports.onNode = function(node, rule, error, html) {
    if (rule.inner_html === undefined) return

    var loc = node.__location
    var innerHTML = html.slice(loc.startTag.endOffset, loc.endTag.startOffset)
    if (matcher.matchValue(innerHTML, rule.inner_html)) return

    var err = ERR.INVALID_INNER_HTML
    error(err, node.tagName, rule.inner_html)
}