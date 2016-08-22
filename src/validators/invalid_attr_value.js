const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.value) {
        var regex = new RegExp(attrRule.value);
        if (regex.test(attr.value)) return;
        var err = ERR.INVALID_ATTR_VALUE;
        var msg = util.format(err.message, node.tagName, attr.name, attr.value);
        engine.createError(err.code, msg, node.__location);
    }
};
