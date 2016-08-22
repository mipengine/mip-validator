const _ = require('lodash');
const ERR = require('../error.json');
const matcher = require('../matcher.js');
const util = require('util');

exports.onNode = function(node, nodeRule, engine) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(nodeRule.attrs, (rules, attrName) => {
        rules.map(rule => {
            if (rule.mandatory &&
                matcher.matchAttrs(node, rule.match) &&
                !attrOccurrence[attrName]) {

                var err = ERR.MANDATORY_ONEOF_ATTR_MISSING;
                var msg = util.format(err.message, node.nodeName, attrName);
                engine.createError(err.code, msg, node.__location);
            }
        });
    });
};
