const _ = require('lodash');
const ERR = require('../error-code.json');
const zh_cn = require('../../i18n/zh_cn.json');

exports.onNode = function(node, rule, engine) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(rule.attrs, (rule, ruleName) => {
        if (rule.mandatory && !attrOccurrence[ruleName]) {
            var code = ERR.MANDATORY_ONEOF_ATTR_MISSING;
            var msg = zh_cn[code];
            engine.createError(code, msg, node.__location);
        }
    });
};
