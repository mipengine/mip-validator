const parse5 = require('parse5');
const _ = require('lodash');

function Engine(rules) {
    this.rules = rules;
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
    _.map(this.onBeginCbs, cb => cb(this.rules, this));
};

Engine.prototype.onNode = function(node, rule) {
    _.map(this.onNodeCbs, cb => cb(node, rule, this));
};

Engine.prototype.onAttr = function(attr, attrRule, node, rule) {
    _.map(this.onAttrCbs, cb => cb(attr, attrRule, node, rule, this));
};

Engine.prototype.onEnd = function() {
    _.map(this.onEndCbs, cb => cb(this.rules, this));
};

Engine.prototype.dfs = function(node) {
    var rule = this.rules[node.nodeName];
    if (rule) {
        this.onNode(node, rule);

        var attrs = node.attrs || [];
        attrs.forEach(attr => {
            var attrRule = _.get(rule.attrs, attr.name);
            if (attrRule) {
                this.onAttr(attr, attrRule, node, rule);
            }
        });
    }
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
