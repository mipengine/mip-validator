const _ = require('lodash');
const ERR = require('../error-code.json');
const zh_cn = require('../../i18n/zh_cn.json');

exports.onNode = function(node, rule, engine) {
    if (rule.disallow) {
        var code = ERR.DISALLOWED_TAG;
        var msg = zh_cn[code];
        engine.createError(code, msg, node.__location);
    }
};
