const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onNode = function(node, rule, engine) {
    if (!rule.mandatory_parent) return;

    var parent = node.parentNode && node.parentNode.nodeName;
    if (_.includes(rule.mandatory_parent, parent)) return;

    var err = ERR.WRONG_PARENT_TAG;
    var msg = util.format(err.message,
        node.nodeName,
        rule.mandatory_parent,
        parent);
    return engine.createError(err.code, msg, node.__location);
};
