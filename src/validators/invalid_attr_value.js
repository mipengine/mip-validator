const _ = require('lodash');
const ERR = require('../error.json');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.value) {
        var regex = new RegExp(attrRule.value);
        if (regex.test(attr.value)) return;
        var err = ERR.INVALID_ATTR_VALUE;
        engine.createError(err.code, err.message, node.__location);
    }
};
