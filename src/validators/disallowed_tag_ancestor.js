const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onNode = function(node, rule, error, engine) {
    if (!rule.disallowed_ancestor) return;

    for (var cur = node.parentNode; cur && cur.nodeName; cur = cur.parentNode) {
        if (_.includes(rule.disallowed_ancestor, cur.nodeName)) {
            var err = ERR.DISALLOWED_TAG_ANCESTOR;
            return error(err, node.nodeName, cur.nodeName);
        }
    }
};
