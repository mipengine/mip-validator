const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['html', 'body', 'head'];

var cache;

exports.onBegin = function(engine) {
    cache = {};

    // TODO: remove array test
    _.forOwn(engine.rules, (rule, ruleName) => {
        var duplicates = _.isArray(rule.duplicate) ?
            rule.duplicate : [rule.duplicate];

        _.map(duplicates, pattern => {
            var fingerprint = serialize(ruleName, pattern);
            cache[fingerprint] = 0;
        });
    });

    validatePolyfill(engine);
};

exports.onNode = function(node, rule, engine) {
    if(!rule.duplicate) return;

    var duplicates = _.isArray(rule.duplicate) ?
        rule.duplicate : [rule.duplicate];

    _.map(duplicates, pattern => {
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

function validatePolyfill(engine){
    // TODO: respect rules
    POLYFILL_TAGS.forEach(tag => {
        var re = new RegExp(`<\\s*${tag}(\\s+.*)*>`, 'g');
        var match = engine.html.match(re);
        if(match && match.length > 1){
            var err = ERR.DUPLICATE_UNIQUE_TAG;
            var msg = err.message;
            engine.createError(err.code, msg);
        }
    });
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
