const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');
const matcher = require('../matcher.js');
const POLYFILL_TAGS = ['html', 'body', 'head'];

// Tag 标记，Tag OR 标记
var tags, ors;

exports.onBegin = function(engine) {
    tags = {};
    ors = {};

    // 初始化Mandatory标记
    _.forOwn(engine.config.nodes, (rules, ruleName) => {
        _.map(rules, rule => {
            if (rule.mandatory) {
                _.map(rule.mandatory, pattern => {
                    var fp = matcher.fingerprintByObject(ruleName, pattern);
                    tags[fp] = {
                        rule: rule,
                        ruleName: ruleName,
                        pattern: pattern,
                        count: 0
                    };
                });
            }
            if (rule.mandatory_or) {
                ors[ruleName] = {
                    rule: rule,
                    ruleName: ruleName,
                    count: 0
                };
            }
        });
    });

    validatePolyfill(engine);
};

exports.onNode = function(node, rule) {
    _.map(rule.mandatory, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;

        var fp = matcher.fingerprintByObject(node.nodeName, pattern);
        tags[fp].count++;
    });
    _.map(rule.mandatory_or, pattern => {
        if (!matcher.matchAttrs(node, pattern)) return;
        ors[node.nodeName].count++;
    });
};

exports.onEnd = function(engine) {
    _.forOwn(tags, (v, k) => {
        if (v.rule.mandatory && v.count < 1) {
            var err = ERR.MANDATORY_TAG_MISSING;
            var message = util.format(err.message, k);
            engine.createError(err.code, message);
        }
    });
    _.forOwn(ors, (v, k) => {
        if (v.rule.mandatory_or && v.count < 1) {
            var err = ERR.MANDATORY_TAG_MISSING;
            var fps = v.rule.mandatory_or
                .map(rule => matcher.fingerprintByObject(k, rule))
                .join("'或'");
            var message = util.format(err.message, fps);
            engine.createError(err.code, message);
        }
    });
};

function validatePolyfill(engine) {
    POLYFILL_TAGS.forEach(tag => {
        var rules = _.get(engine.config.nodes, `${tag}`);
        _.map(rules, rule => {
            if (!rule.mandatory) return;

            var re = new RegExp(`<${tag}(\\s+.*)*>`, 'g');
            var match = engine.html.match(re);
            if (!match) {
                var err = ERR.MANDATORY_TAG_MISSING;
                var msg = util.format(err.message, `<${tag}>`);
                engine.createError(err.code, msg);
            }
        });
    });
}
