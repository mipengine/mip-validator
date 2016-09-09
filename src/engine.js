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

Engine.prototype.onNode = function(node, nodeRules, regexNodeRules) {
    _.forEach(nodeRules, nodeRule => {
        if (!nodeRule.match || matcher.matchAttrs(node, nodeRule.match)) {
            _.map(this.onNodeCbs, cb => cb(node, nodeRule, this));

            // for each attribute
            _.forEach(node.attrs, attr => {
                // retrieve rule for the attribute
                var attrRule = _.get(nodeRule.attrs, attr.name);
                if (attrRule) {
                    this.onAttr(attr, attrRule, node, nodeRule);
                }
                // traversal regex rules for the attribute
                _.forEach(nodeRule.regexAttrs, (attrRules, attrName) => {
                    if (attrRules.regex.test(attr.name)) {
                        this.onAttr(attr, attrRules, node, nodeRule);
                    }
                });
            });
        }
    });
};

Engine.prototype.onAttr = function(attr, attrRules, node, nodeRule) {
    attrRules.map(rule => {
        if (matcher.matchAttrs(node, rule.match)) {
            _.map(this.onAttrCbs, cb => cb(attr, rule, node, nodeRule, this));
        }
    });
};

Engine.prototype.onEnd = function() {
    _.map(this.onEndCbs, cb => cb(this));
};

Engine.prototype.dfs = function(node) {
    var nodeRules = this.config.nodes[node.nodeName];
    var regexNodeRules = this.config.regexNodes;
    this.onNode(node, nodeRules, regexNodeRules);
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
