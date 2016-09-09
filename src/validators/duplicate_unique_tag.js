const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['html', 'body', 'head'];
const matcher = require('../matcher.js');
const util = require('util');

var cache;

exports.onBegin = function(error, engine) {
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

    validatePolyfill(error, engine);
};

exports.onNode = function(node, rule, error, engine) {
    if (!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return;

    var duplicates = _.isArray(rule.duplicate) ?
        rule.duplicate : [rule.duplicate];

    _.map(duplicates, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fingerprint = matcher.fingerprintByObject(node.nodeName, pattern);
        cache[fingerprint]++;
        if (cache[fingerprint] <= 1) return;

        var tagStr = matcher.fingerprintByObject(node.nodeName, pattern);
        error(ERR.DUPLICATE_UNIQUE_TAG, tagStr);
    });
};

function validatePolyfill(error, engine) {
    POLYFILL_TAGS.forEach(tag => {
        var rules = _.get(engine.config.nodes, `${tag}`);
        _.map(rules, rule => {
            if (!rule.duplicate) return;

            var re = new RegExp(`<\\s*${tag}(\\s+.*)*>`, 'g');
            var match = engine.html.match(re);
            if (match && match.length > 1) {
                error(ERR.DUPLICATE_UNIQUE_TAG, tag);
            }
        });
    });
}
