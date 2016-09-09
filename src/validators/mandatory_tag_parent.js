const _ = require('lodash');
const ERR = require('../error.json');

exports.onNode = function(node, rule, error, engine) {
    if (!rule.mandatory_parent) return;

    var parent = node.parentNode && node.parentNode.nodeName;
    if (_.includes(rule.mandatory_parent, parent)) return;

    error(ERR.WRONG_PARENT_TAG, node.nodeName,
        rule.mandatory_parent, parent);
};
