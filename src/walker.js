const _ = require('lodash')
const matcher = require('./matcher.js')
const logger = require('./logger.js')('mip-validator:walker')

/**
 * The validation engine constructor
 *
 * @class
 * @param {Object} config plain object configuring normalizedRules, rawRules, and regexRules
 */
function Walker(config) {
    this.onBeginCbs = []
    this.onEndCbs = []
    this.onAttrCbs = []
    this.onNodeCbs = []
    this.config = config
}

Walker.prototype.register = function(validator) {
    validator.onBegin && this.onBeginCbs.push(validator.onBegin)
    validator.onEnd && this.onEndCbs.push(validator.onEnd)
    validator.onNode && this.onNodeCbs.push(validator.onNode)
    validator.onAttr && this.onAttrCbs.push(validator.onAttr)
}

/**
 * Callback when DFS begins
 *
 * @param {Function} error errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onBegin = function(error, html) {
    logger.debug('onBegin')
    _.map(this.onBeginCbs, cb => cb(error, html, this.config.rules))
}

/*
 * Callback when DFS found a Node
 * @param {ASTNode}  node   the node currently found, see:
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {Function} error  errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onNode = function(node, error, html) {
    logger.debug('onNode', node.nodeName)
        // get active rules
    var rules = _.chain(this.config.regexNodes)
        .filter((rules) => matcher.matchValue(node.nodeName, rules.regexStr))
        .flatten()
        .concat(this.config.rules[node.nodeName] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .filter(rule => matcher.matchParent(node, rule.match_parent))
        .filter(rule => matcher.matchAncestor(node, rule.match_ancestor))
        .value()

    _.forEach(rules, nodeRule => {
        // invoke callbacks
        _.map(this.onNodeCbs, cb => {
            cb(node, nodeRule, nodeError, html, this.config.rules)
        })
            // traverse attributes
        _.forEach(node.attrs, attr => this.onAttr(attr, node, nodeRule, nodeError, html))
    })

    // error generator
    function nodeError(e) {
        e.location = node.__location
        error.apply(null, arguments)
    }
}

/*
 * Callback when DFS found an attribute
 * @param {ASTAttribute} attribute the attribute currently found
 *   https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {ASTNode} node the parent node
 * @param {Object} nodeRule rule config object for the node
 * @param {Function} error  errorFactory to create an error
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onAttr = function(attr, node, nodeRule, error, html) {
    // get rules
    var rules = _.chain(nodeRule.regexAttrs)
        .filter((rules) => matcher.matchValue(attr.name, rules.regexStr))
        .flatten()
        .concat(nodeRule.attrs[attr.name] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .filter(rule => matcher.nomatchDescendant(node, rule.nomatch_descendant))
        .value()
        // call callbacks
    rules.map(rule => {
        _.map(this.onAttrCbs, cb => cb(attr, rule, node, nodeRule, error, html, this.config.rules))
    })
}

/*
 * Callback when DFS ends
 * @param {Function} error errorFactory to create an error.
 * @param {string} html the whole html of the document to validate
 */
Walker.prototype.onEnd = function(error, html) {
    logger.debug('onEnd')
    _.map(this.onEndCbs, cb => cb(error, html, this.config.rules))
}

/*
 * Do a DFS for the node
 * @param {ASTNode}  node the root node to dfs with
 * @param {Function} error errorFactory to create an error.
 * @param {String} html the whole html of the document to validate
 */
Walker.prototype.dfs = function(node, error, html) {
    if (node.nodeName === 'template') {
        logger.debug('<template> encountered')
        node.childNodes = node.content.childNodes
        node.childNodes.forEach(child => (child.parentNode = node))
    }

    this.onNode(node, error, html)
    var children = node.childNodes || []
    children.forEach(child => this.dfs(child, error, html))
}

Walker.prototype.validate = function(document, errorGenertor, html) {
    this.onBegin(errorGenertor, html)
    this.dfs(document, errorGenertor, html)
    this.onEnd(errorGenertor, html)
}

module.exports = function(rules) {
    return new Walker(rules)
}