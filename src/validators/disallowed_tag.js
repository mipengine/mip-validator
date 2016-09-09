const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['frame', 'frameset'];
const util = require('util');
const matcher = require('../matcher.js');

exports.onBegin = function(error, engine) {
    validatePolyfill(error, engine);
};

exports.onNode = function(node, rule, error, engine) {
    if (!rule.disallow || _.includes(POLYFILL_TAGS, node.nodeName)) return;
    var err = ERR.DISALLOWED_TAG;
    error(err, matcher.fingerprintByTag(node));
};

// parse5 do not support frameset/frame
// ref: https://github.com/inikulin/parse5/issues/6
function validatePolyfill(error, engine) {
    var re = tagPattern(POLYFILL_TAGS), match;
    while (match = re.exec(engine.html)) {
        var input = match[0];
        var tag = match[1];
        var rules = _.get(engine.config.nodes, `${tag}`);
        _.map(rules, rule => {
            if (!rule.disallow) return;

            var err = ERR.DISALLOWED_TAG;
            error(err, tag);
        });
    }
}

function tagPattern(tags) {
    var reTags = tags.join('|');
    return new RegExp(`<\\s*(${reTags})(?:\\s+[^>]*)*>`, 'g');
}
