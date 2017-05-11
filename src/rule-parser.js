const _ = require('lodash');
const assert = require('assert');
const defaultRules = require('../rules.json');
const matcher = require('./matcher.js');

var id = 0;

function normalize(rules) {
    return _.chain(rules || defaultRules)
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

    config.mandatory = normalizeArray(config.mandatory);
    config.duplicate = normalizeArray(config.duplicate);
    config.attrs = normalizeAttrs(config.attrs);
    return config;
}

function processNodeRules(nodes) {
    var regexNodes = {};
    // for each node
    _.forEach(nodes, (rules, name) => {
        if (matcher.regexSyntax.test(name)) {
            rules.regexStr = name;
            regexNodes[name] = rules;
        }
        _.forEach(rules, processNodeRule);
    });
    return regexNodes;
}

function processNodeRule(nodeRule) {
    nodeRule.id = id++;
    nodeRule.regexAttrs = {};
    _.forEach(nodeRule.attrs, (rules, name) => {
        if (matcher.regexSyntax.test(name)) {
            rules.regexStr = name;
            nodeRule.regexAttrs[name] = rules;
        }
        _.forEach(rules, processAttrRule);
    });
}

function processAttrRule(attrRule) {
    attrRule.id = id++;
}

function mkConfig(rules){
    var nodes = normalize(rules);
    var regexNodes = processNodeRules(nodes);
    return {
        rules: rules,
        nodes: nodes,
        regexNodes: regexNodes
    };
}

exports.mkConfig = mkConfig;
