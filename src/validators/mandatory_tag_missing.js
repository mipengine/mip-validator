const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

var cache;

exports.onBegin = function(rules) {
    cache = {};

    _.forOwn(rules, (rule, ruleName) => {
        if (!rule.mandatory) return;

        _.map(rule.mandatory, pattern => {
            var fingerprint = serialize(ruleName, pattern);
            cache[fingerprint] = {
                rule: rule,
                ruleName: ruleName,
                pattern: pattern,
                count: 0
            };
        });
    });
};

exports.onNode = function(node, rule) {
    if (!rule.mandatory) return;

    _.map(rule.mandatory, pattern => {
        if (!match(node, pattern)) return;

        var fingerprint = serialize(node.nodeName, pattern);
        cache[fingerprint].count++;
    });
};

exports.onEnd = function(rules, engine) {
    _.forOwn(cache, (v, k) => {
        if (v.count >= 1) return;

        var err = ERR.MANDATORY_TAG_MISSING;
        var message = util.format(err.message, tagStr(v.ruleName, v.pattern));
        engine.createError(err.code, message);
    });
};

function tagStr(tagName, attrs){
    var attrStr =  _.chain(attrs)
        .toPairs()
        .map(attr => `${attr[0]}="${attr[1]}"`)
        .join(' ')
        .value();
    if(attrStr.length){
        attrStr = ' ' + attrStr;
    }
        
    return `<${tagName}${attrStr}>`;
}

function serialize(tagName, pattern) {
    var patternStr = _.chain(pattern)
        .toPairs()
        .map(arr => arr[0] + '_' + arr[1])
        .join(',');
    return tagName + ',' + patternStr;
}

function match(node, pattern) {
    var attrs = _.keyBy(node.attrs, 'name');
    var ret = true;
    _.forOwn(pattern, (v, k) => {
        var regex = new RegExp(v);
        var attr = attrs[k];
        if (!attr) {
            ret = false;
            return;
        }

        var actual = attr.value;
        if (!regex.test(actual)) {
            ret = false;
        }
    });
    return ret;
}
