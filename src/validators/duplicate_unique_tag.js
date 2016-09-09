const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['html', 'body', 'head'];
const matcher = require('../matcher.js');
const util = require('util');

var cache;

exports.onBegin = function(engine) {
    cache = {};

    _.forOwn(engine.config.nodes, (rules, ruleName) => {
        _.map(rules, rule => {
            if (rule.duplicate) {
                _.map(rule.duplicate, pattern => {
                    var fingerprint = matcher.fingerprintByObject(ruleName, pattern);
                    cache[fingerprint] = 0;
                });
            }
        });
    });

    validatePolyfill(engine);
};

exports.onNode = function(node, rule, engine) {
    if (!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return;

    var duplicates = _.isArray(rule.duplicate) ?
        rule.duplicate : [rule.duplicate];

    _.map(duplicates, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fingerprint = matcher.fingerprintByObject(node.nodeName, pattern);
        cache[fingerprint]++;
        if (cache[fingerprint] <= 1) return;

        var err = ERR.DUPLICATE_UNIQUE_TAG;
        var tagStr = matcher.fingerprintByObject(node.nodeName, pattern);
        var msg = util.format(err.message, tagStr);
        engine.createError(err.code, msg, node.__location);
    });
};

function validatePolyfill(engine) {
    POLYFILL_TAGS.forEach(tag => {
        var rules = _.get(engine.config.nodes, `${tag}`);
        _.map(rules, rule => {
            if (!rule.duplicate) return;

            var re = new RegExp(`<\\s*${tag}(\\s+.*)*>`, 'g');
            var match = engine.html.match(re);
            if (match && match.length > 1) {
                var err = ERR.DUPLICATE_UNIQUE_TAG;
                var msg = util.format(err.message, tag);
                engine.createError(err.code, msg);
            }
        });
    });
}
