const _ = require('lodash');
const ERR = require('../error-code.json');
const zh_cn = require('../../i18n/zh_cn.json');

var occurrence = {};

exports.onBegin = function(rules) {
    _.forOwn(rules, (v, k) => {
        occurrence[k] = 0;
    });
};

exports.onNode = function(node) {
    occurrence[node.nodeName]++;
};

exports.onEnd = function(rules, engine) {
    _.forOwn(rules, (v, k) => {
        if (v.mandatory && !occurrence[k]) {
            var code = ERR.MANDATORY_TAG_MISSING;
            var msg = zh_cn[code];
            engine.createError(code, msg);
        }
    });
};
