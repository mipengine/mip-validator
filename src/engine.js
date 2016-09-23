const parse5 = require('parse5');
const _ = require('lodash');
const matcher = require('./matcher.js');
const ValidateError = require('./validate-error.js');

function Engine(config) {
    this.config = config;
    this.onBeginCbs = [];
    this.onEndCbs = [];
    this.onAttrCbs = [];
    this.onNodeCbs = [];
}

Engine.prototype.register = function(validator) {
    validator.onBegin && this.onBeginCbs.push(validator.onBegin);
    validator.onEnd && this.onEndCbs.push(validator.onEnd);
    validator.onNode && this.onNodeCbs.push(validator.onNode);
    validator.onAttr && this.onAttrCbs.push(validator.onAttr);
};

Engine.prototype.onBegin = function(error) {
    //console.log('onBegin');
    _.map(this.onBeginCbs, cb => cb(error, this));
};

Engine.prototype.onNode = function(node, config, error) {
    //console.log('onNode', node.nodeName);
    // get rules
    var rules = _.chain(config.regexNodes)
        .filter((rules, name) => rules.regex.test(node.nodeName))
        .flatten()
        .concat(config.nodes[node.nodeName] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .value();

    _.forEach(rules, nodeRule => {
        // call callbacks
        _.map(this.onNodeCbs, cb => {
            cb(node, nodeRule, nodeError, this);
        });
        // traversal attributes
        _.forEach(node.attrs, attr => this.onAttr(attr, node, nodeRule, nodeError));
    });

    // error generator
    function nodeError(e) {
        e.location = node.__location;
        error.apply(null, arguments);
    }
};

Engine.prototype.onAttr = function(attr, node, nodeRule, error) {
    // get rules
    var rules = _.chain(nodeRule.regexAttrs)
        .filter((rules, name) => rules.regex.test(attr.name))
        .flatten()
        .concat(nodeRule.attrs[attr.name] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .value();
    // call callbacks
    rules.map(rule => {
        _.map(this.onAttrCbs, cb => cb(attr, rule, node, nodeRule, error, this));
    });
};

Engine.prototype.onEnd = function(error) {
    //console.log('onEnd');
    _.map(this.onEndCbs, cb => cb(error, this));
};

Engine.prototype.dfs = function(node, error) {
    //console.log('dfs', node.nodeName);
    this.onNode(node, this.config, error);
    var children = node.childNodes || [];
    children.forEach(child => this.dfs(child, error));
};

Engine.prototype.validate = function(html) {
    this.html = html;

    var document = parse5.parse(html, {
        locationInfo: true
    });
    var errorGenertor = ValidateError.generator({
        html: html
    });

    this.onBegin(errorGenertor);
    this.dfs(document, errorGenertor);
    this.onEnd(errorGenertor);

    return errorGenertor.errors;
};

module.exports = function(rules) {
    return new Engine(rules);
};
