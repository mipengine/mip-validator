const _ = require('lodash');
const matcher = require('./matcher.js');

function process(config) {
    processAttrRules(config.nodes);
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
    });
}

function processAttrRules(nodes) {
    // for each rule of each node
    _.forEach(nodes, (nodeRules, nodeName) => {
        _.forEach(nodeRules, (nodeRule) => {
            // init regexAttrs for the node rule
            nodeRule.regexAttrs = {};
            // for each attr rule
            _.forEach(nodeRule.attrs, (rules, name) => {
                var re = matcher.stringToRegex(name);
                rules.regex = re;
                if (re) {
                    nodeRule.regexAttrs[name] = rules;
                }
            });
        });
    });
}

exports.process = process;
