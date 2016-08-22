const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');
const matcher = require('../matcher.js');

exports.onAttr = function(attr, attrRule, node, nodeRule, engine) {
    if (!attrRule.properties) return;

    var obj = parseValueProperties(attr.value);
    _.forOwn(attrRule.properties, (value, key) => {
        var property = {
            name: key,
            value: obj[key]
        };

        if (property.value == value) return;

        var err = ERR.INVALID_PROPERTY_VALUE_IN_ATTR_VALUE;
        var msg = util.format(err.message,
            node.nodeName, attr.name,
            property.name, property.value || '');

        engine.createError(err.code, msg, node.__location);
    });
};

function parseValueProperties(value) {
    return _.chain(value || '')
        .split(/[,;]/)
        .map(propertyStr => propertyStr.split('=').map(_.trim))
        .fromPairs()
        .value();
}
