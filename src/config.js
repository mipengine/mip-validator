const _ = require('lodash');
const assert = require('assert');
const rules = require('../rules.json');

function normalize(config) {
    return config = _.chain(config || rules)
        .toPairs()
        .map(pair => [
            pair[0],
            normalizeArray(pair[1]).map(tag => normalizeTag(tag))
        ])
        .fromPairs()
        .value();
}

function normalizeArray(v) {
    if (!v) {
        return [];
    }
    if (v === true) {
        v = {};
    }
    if (!_.isArray(v)) {
        v = [v];
    }
    return v;
}

function normalizeAttrs(attrs) {
    return _.chain(attrs)
        .toPairs()
        .map(pair => [pair[0], normalizeArray(pair[1])])
        .fromPairs()
        .value();
}

function normalizeTag(config) {
    assert(_.isObject(config), 'node name should be Array or Object');

    if (config.mandatory) config.mandatory = normalizeArray(config.mandatory);
    if (config.duplicate) config.duplicate = normalizeArray(config.duplicate);
    if (config.attrs) config.attrs = normalizeAttrs(config.attrs);
    return config;
}

exports.normalize = normalize;
