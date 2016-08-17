const _ = require('lodash');
const ERR = require('../error-code.json');
const zh_cn = require('../../i18n/zh_cn.json');

exports.onAttr = function(attr, attrRule, node, rule, engine) {
    if (attrRule.disallow) {
        var code = ERR.DISALLOWED_ATTR;
        var msg = zh_cn[code];
        engine.createError(msg, code, node.__location);
    }
};
