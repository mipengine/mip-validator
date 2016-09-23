const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['html', 'body', 'head'];
const matcher = require('../matcher.js');
const util = require('util');

var cache;

exports.onBegin = function(error, engine) {
    //console.log('[DUPLICATE_UNIQUE_TAG] onBegin');
    cache = {};

    _.forOwn(engine.config.nodes, (rules, ruleName) => {
        //console.log('rules', rules);
        _.map(rules, rule => {
            //console.log('rule', rule);
            if (rule.duplicate) {
                _.map(rule.duplicate, pattern => {
                    //console.log('pattern', pattern);
                    var fingerprint = matcher.fingerprintByObject(ruleName, pattern);
                    var hash = fingerprint + rule.id;
                    cache[hash] = 0;
                });
            }
        });
    });
    //console.log('[DUPLICATE_UNIQUE_TAG] before polyfill');
    validatePolyfill(error, engine);
    //console.log('[DUPLICATE_UNIQUE_TAG] after polyfill');
    //console.log('[DUPLICATE_UNIQUE_TAG] after onBegin');
};

exports.onNode = function(node, rule, error, engine) {
    if (!rule.duplicate || _.includes(POLYFILL_TAGS, node.nodeName)) return;

    var duplicates = _.isArray(rule.duplicate) ?
        rule.duplicate : [rule.duplicate];

    _.map(duplicates, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fingerprint = matcher.fingerprintByObject(node.nodeName, pattern);
        var hash = fingerprint + rule.id;
        cache[hash]++;
        if (cache[hash] <= 1) return;

        error(ERR.DUPLICATE_UNIQUE_TAG, fingerprint);
    });
};

function validatePolyfill(error, engine) {
    POLYFILL_TAGS.forEach(tag => {
        var rules = _.get(engine.config.nodes, `${tag}`);
        _.map(rules, rule => {
            if (!rule.duplicate) return;
            var matches = matcher.matchTagNames([tag], engine.html);
            if (matches.length > 1) {
                error(ERR.DUPLICATE_UNIQUE_TAG, tag);
            }
        });
    });
}
