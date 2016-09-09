const _ = require('lodash');
const ERR = require('../error.json');
const matcher = require('../matcher.js');

exports.onNode = function(node, nodeRule, error, engine) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(nodeRule.attrs, (rules, attrName) => {
        rules.map(rule => {
            if (rule.mandatory &&
                matcher.matchAttrs(node, rule.match) &&
                !attrOccurrence[attrName]) {

                var err = ERR.MANDATORY_ONEOF_ATTR_MISSING;
                error(err, node.nodeName, attrName);
            }
        });
    });
};
