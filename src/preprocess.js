const _ = require('lodash');
const matcher = require('./matcher.js');

var id = 0;

function process(config) {
    processNodeRules(config);
    return config;
}

function processNodeRules(config) {
    config.regexNodes = {};
    // for each node
    _.forEach(config.nodes, (rules, name) => {
        if (matcher.regexSyntax.test(name)) {
            rules.regexStr = name;
            config.regexNodes[name] = rules;
        }
        _.forEach(rules, processNodeRule);
    });
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

exports.process = process;
