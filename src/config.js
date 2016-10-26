const _ = require('lodash');
const assert = require('assert');
const defaultRules = require('../rules.json');

function normalize(config) {
    config.nodes = _.chain(config.rules || defaultRules)
        .toPairs()
        .map(pair => [
            pair[0],
            normalizeArray(pair[1]).map(tag => normalizeTag(tag))
        ])
        .fromPairs()
        .value();
    return config;
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

    config.mandatory = normalizeArray(config.mandatory);
    config.duplicate = normalizeArray(config.duplicate);
    config.attrs = normalizeAttrs(config.attrs);
    return config;
}

exports.normalize = normalize;
