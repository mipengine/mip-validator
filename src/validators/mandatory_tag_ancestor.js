const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onNode = function(node, rule, engine) {
    if (!rule.mandatory_ancestor) return;

    for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
        if (rule.mandatory_ancestor === cur.nodeName) {
            return;
        }
    }
    var err = ERR.MANDATORY_TAG_ANCESTOR;
    var msg = util.format(err.message, node.nodeName, rule.mandatory_ancestor);
    return engine.createError(err.code, msg, node.__location);
};
