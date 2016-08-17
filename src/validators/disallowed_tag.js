const _ = require('lodash');
const ERR = require('../error.json');

exports.onNode = function(node, rule, engine) {
    if (rule.disallow) {
        var err = ERR.DISALLOWED_TAG;
        engine.createError(err.code, err.message, node.__location);
    }
};
