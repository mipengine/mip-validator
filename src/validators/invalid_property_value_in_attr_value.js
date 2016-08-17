const _ = require('lodash');
const ERR = require('../error.json');
const util = require('util');

exports.onAttr = function(attr, attrRules, node, rule, engine) {
    // normalize attrRules
    if (!_.isArray(attrRules)) {
        attrRules = [attrRules];
    }

    // filter rules according to match
    var rules = attrRules.filter(r => attrMatch(node.attrs, r.match));
    if (!rules.length) {
        var defaultRule = getDefaultRule(attrRules);
        defaultRule && rules.push(defaultRule);
    }

    // apply rules
    rules.map(r => {
        if (!r.properties) return;

        var obj = parseValueProperties(attr.value);
        _.forOwn(r.properties, (value, key) => {
            var property = {
                name: key,
                value: obj[key]
            };

            if (property.value == value) return;

            var err = ERR.INVALID_PROPERTY_VALUE_IN_ATTR_VALUE;
            var msg = util.format(err.message,
                node.nodeName, attr.name,
                property.name, property.value);

            engine.createError(err.code, msg, node.__location);
        });
    });
};

function parseValueProperties(value) {
    return _.chain(value || '')
        .split(/[,;]/)
        .map(propertyStr => propertyStr.split('=').map(_.trim))
        .fromPairs()
        .value();
}

function getDefaultRule(rules) {
    return _.find(rules, r => !r.match);
}

function attrMatch(attrs, matchStr) {
    if (!matchStr) return false;

    var tokens = matchStr.split('=');
    var match = {
        name: tokens[0],
        value: tokens[1]
    };

    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        if (attr.name == match.name && attr.value == match.value) {
            return true;
        }
    }
    return false;
}
