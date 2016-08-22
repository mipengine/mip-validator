const _ = require('lodash');
const ERR = require('../error.json');

exports.onNode = function(node, nodeRule, engine) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(nodeRule.attrs, (rules, attrName) => {
        rules.map(rule => {
            if (rule.mandatory && !attrOccurrence[attrName]) {
                var err = ERR.MANDATORY_ONEOF_ATTR_MISSING;
                engine.createError(err.code, err.message, node.__location);
            }
        });
    });
};
