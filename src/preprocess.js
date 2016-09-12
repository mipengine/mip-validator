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
        var re = matcher.stringToRegex(name);
        if (re) {
            rules.regex = re;
            config.regexNodes[name] = rules;
        }
        _.forEach(rules, processNodeRule);
    });
}

function processNodeRule(nodeRule) {
    nodeRule.id = id++;
    nodeRule.regexAttrs = {};
    _.forEach(nodeRule.attrs, (rules, name) => {
        var re = matcher.stringToRegex(name);
        rules.regex = re;
        if (re) {
            nodeRule.regexAttrs[name] = rules;
        }
        _.forEach(rules, processAttrRule);
    });
}

function processAttrRule(attrRule) {
    attrRule.id = id++;
}

exports.process = process;
