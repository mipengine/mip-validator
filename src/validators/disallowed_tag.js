const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['frame', 'frameset'];
const util = require('util');
const matcher = require('../matcher.js');
const logger = require('../logger.js');

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
    logger.debug('begin polyfills', matches);
    var matches = matcher.matchTagNames(POLYFILL_TAGS, engine.html);
    matches.forEach(function(tag){
        var tagName = tag.match(/\w+/);
        var rules = _.get(engine.config.nodes, `${tagName}`);
        _.map(rules, rule => {
            if (!rule.disallow) return;

            var err = ERR.DISALLOWED_TAG;
            error(err, tag);
        });
    });
}

