const _ = require('lodash');
const ERR = require('../error.json');
const matcher = require('../matcher.js');

exports.onAttr = function(attr, attrRule, node, nodeRule, error, engine) {
    if (!attrRule.properties) return;

    var obj = parseValueProperties(attr.value);
    _.forOwn(attrRule.properties, (value, key) => {
        var property = {
            name: key,
            value: obj[key]
        };

        if (property.value == value) return;

        error(ERR.INVALID_PROPERTY_VALUE_IN_ATTR_VALUE,
            node.nodeName, attr.name,
            property.name, property.value || '');
    });
};

function parseValueProperties(value) {
    return _.chain(value || '')
        .split(/[,;]/)
        .map(propertyStr => propertyStr.split('=').map(_.trim))
        .fromPairs()
        .value();
}
