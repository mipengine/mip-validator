const _ = require('lodash');
const ERR = require('../error.json');

var cache, engine;

exports.onBegin = function(rules, _engine) {
    cache = {};
    engine = _engine;

    _.forOwn(rules, (rule, ruleName) => {
        _.map(rule.duplicate, pattern => {
            var fingerprint = serialize(ruleName, pattern);
            cache[fingerprint] = 0;
        });
    });
};

exports.onNode = function(node, rule) {
    _.map(rule.duplicate, pattern => {
        if (!match(node, pattern)) return;

        var fingerprint = serialize(node.nodeName, pattern);
        cache[fingerprint]++;
        if (cache[fingerprint] <= 1) return;

        var err = ERR.DUPLICATE_UNIQUE_TAG;
        engine.createError(err.code, err.message, node.__location);
    });
};

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
        var actual = attrs[k].value;
        if (!regex.test(actual)) {
            ret = false;
        }
    });
    return ret;
}
