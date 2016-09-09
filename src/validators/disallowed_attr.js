const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.disallow) {
        var err = ERR.DISALLOWED_ATTR;
        var msg = util.format(err.message, node.tagName, attr.name);
        engine.createError(err.code, msg, node.__location);
    }
};
