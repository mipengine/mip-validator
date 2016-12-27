const parse5 = require('parse5');
const _ = require('lodash');
const matcher = require('./matcher.js');
const ValidateError = require('./validate-error.js');
const logger = require('./logger.js')('mip-validator:engine');

function Engine(config) {
    this.config = config;
    this.onBeginCbs = [];
    this.onEndCbs = [];
    this.onAttrCbs = [];
    this.onNodeCbs = [];
}

/*
 * Register a validator
 * @param {Object} validator
 */
Engine.prototype.register = function(validator) {
    validator.onBegin && this.onBeginCbs.push(validator.onBegin);
    validator.onEnd && this.onEndCbs.push(validator.onEnd);
    validator.onNode && this.onNodeCbs.push(validator.onNode);
    validator.onAttr && this.onAttrCbs.push(validator.onAttr);
};

/*
 * Callback when DFS begins
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.onBegin = function(error) {
    logger.debug('onBegin');
    _.map(this.onBeginCbs, cb => cb(error, this));
};

/*
 * Callback when DFS found a Node
 * @param {ASTNode}  node   the node currently found, see:
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {Function} error  errorFactory to create an error.
 */
Engine.prototype.onNode = function(node, error) {
    logger.debug('onNode', node.nodeName);
    // get rules
    var rules = _.chain(this.config.regexNodes)
        .filter((rules, name) => rules.regex.test(node.nodeName))
        .flatten()
        .concat(this.config.nodes[node.nodeName] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .filter(rule => matcher.matchParent(node, rule.match_parent))
        .filter(rule => matcher.matchAncestor(node, rule.match_ancestor))
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

/*
 * Callback when DFS found an attribute
 * @param {ASTAttribute} attribute the attribute currently found
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {ASTNode}      node the parent node
 * @param {Object}       nodeRule rule config object for the node
 * @param {Function}     error  errorFactory to create an error
 */
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

/*
 * Callback when DFS ends
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.onEnd = function(error) {
    logger.debug('onEnd');
    _.map(this.onEndCbs, cb => cb(error, this));
};

/*
 * Do a DFS for the node
 * @param {ASTNode}  node the root node to dfs with
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.dfs = function(node, error) {
    if(node.nodeName === 'template'){
        logger.debug('<template> encountered');
        node.childNodes = node.content.childNodes;
        node.childNodes.forEach(child => child.parentNode = node);
    }
    this.onNode(node, error);
    var children = node.childNodes || [];
    children.forEach(child => this.dfs(child, error));
};

/*
 * Validate the HTML
 * @param {String} html The HTML to validate
 */
Engine.prototype.validate = function(html) {
    this.html = html;

    var document = parse5.parse(html, {
        locationInfo: true
    });
    var errorGenertor = ValidateError.generator({
        html: html,
        fast: this.config.fast
    });

    try {
        this.onBegin(errorGenertor);
        this.dfs(document, errorGenertor);
        this.onEnd(errorGenertor);
        return this.config.fast ? [] : errorGenertor.errors;
    } catch (e) {
        if (this.config.fast) {
            return [e];
        } else {
            throw e;
        }
    }
};

module.exports = function(rules) {
    return new Engine(rules);
};
