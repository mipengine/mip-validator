const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['html', 'body', 'head'];
const matcher = require('../matcher.js');

var cache;

exports.onBegin = function(engine) {
    cache = {};

    _.forOwn(engine.rules, (rule, ruleName) => {
        _.map(rule.duplicate, pattern => {
            var fingerprint = serialize(ruleName, pattern);
            cache[fingerprint] = 0;
        });
    });

    validatePolyfill(engine);
};

exports.onNode = function(node, rule, engine) {
    if(!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return;

    var duplicates = _.isArray(rule.duplicate) ?
        rule.duplicate : [rule.duplicate];

    _.map(duplicates, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;

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
    POLYFILL_TAGS.forEach(tag => {
        if(!_.get(engine.rules, `${tag}.duplicate`)) return;

        var re = new RegExp(`<\\s*${tag}(\\s+.*)*>`, 'g');
        var match = engine.html.match(re);
        if(match && match.length > 1){
            var err = ERR.DUPLICATE_UNIQUE_TAG;
            var msg = err.message;
            engine.createError(err.code, msg);
        }
    });
}
