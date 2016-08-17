const _ = require('lodash');
const ERR = require('../error.json');

exports.onNode = function(node, rule, engine) {
    var attrOccurrence = _.keyBy(node.attrs, 'name');

    _.forOwn(rule.attrs, (rule, ruleName) => {
        if (rule.mandatory && !attrOccurrence[ruleName]) {
            var err = ERR.MANDATORY_ONEOF_ATTR_MISSING;
            engine.createError(err.code, err.message, node.__location);
        }
    });
};
