const _ = require('lodash');
const ERR = require('../error.json');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.disallow) {
        var err = ERR.DISALLOWED_ATTR;
        engine.createError(err.message, err.code, node.__location);
    }
};
