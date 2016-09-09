const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');
const matcher = require('../matcher.js');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.disallow) {
        var err = ERR.DISALLOWED_ATTR;
        var tagStr = matcher.fingerprintByObject(node.tagName);
        var msg = util.format(err.message, tagStr, attr.name);
        engine.createError(err.code, msg, node.__location);
    }
};
