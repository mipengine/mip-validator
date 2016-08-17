const _ = require('lodash');
const ERR = require('../error-code.json');
const zh_cn = require('../../i18n/zh_cn.json');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.value) {
        var regex = new RegExp(attrRule.value);
        if (regex.test(attr.value)) return;
        var code = ERR.INVALID_ATTR_VALUE;
        var msg = zh_cn[code];
        engine.createError(code, msg, node.__location);
    }
};
