const parse5 = require('parse5');
const _ = require('lodash');
const matcher = require('./matcher.js');

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

Engine.prototype.createError = function(code, message, location) {
    var err = {
        code: code || "000",
        message: message,
        line: location ? location.line : 0,
        col: location ? location.col : 0,
        offset: location ? location.startOffset : 0,
        input: location ? this.lines[location.line - 1] : ''
    };
    this.errors.push(err);
};

Engine.prototype.onBegin = function() {
    _.map(this.onBeginCbs, cb => cb(this));
};

Engine.prototype.onNode = function(node, config) {
    // get rules
    var rules = _.chain(config.regexNodes)
        .filter((rules, name) => rules.regex.test(node.nodeName))
        .flatten()
        .concat(config.nodes[node.nodeName] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .value();

    _.forEach(rules, nodeRule => {
        // call callbacks
        _.map(this.onNodeCbs, cb => cb(node, nodeRule, this));
        // traversal attributes
        _.forEach(node.attrs, attr => this.onAttr(attr, node, nodeRule));
    });
};

Engine.prototype.onAttr = function(attr, node, nodeRule) {
    // get rules
    var rules = _.chain(nodeRule.regexAttrs)
        .filter((rules, name) => rules.regex.test(attr.name))
        .flatten()
        .concat(nodeRule.attrs[attr.name] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .value();
    // call callbacks
    rules.map(rule => {
        _.map(this.onAttrCbs, cb => cb(attr, rule, node, nodeRule, this));
    });
};

Engine.prototype.onEnd = function() {
    _.map(this.onEndCbs, cb => cb(this));
};

Engine.prototype.dfs = function(node) {
    this.onNode(node, this.config);
    var children = node.childNodes || [];
    children.forEach(child => this.dfs(child));
};

Engine.prototype.validate = function(html) {
    this.errors = [];
    this.html = html;
    this.lines = html.split('\n');

    var document = parse5.parse(html, {
        locationInfo: true
    });

    this.onBegin();
    this.dfs(document);
    this.onEnd();

    return this.errors;
};

module.exports = function(rules) {
    return new Engine(rules);
};
