const parse5 = require('parse5');
const _ = require('lodash');
const matcher = require('./matcher.js');
const ValidateError = require('./validate-error.js');
const logger = require('./logger.js')('mip-validator:engine');
const ERR = require('./error.json');
const checkUTF8 = require('./encoding.js').checkUTF8;

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
        .filter((rules) => rules.regex.test(node.nodeName))
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
        .filter((rules) => rules.regex.test(attr.name))
        .flatten()
        .concat(nodeRule.attrs[attr.name] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .filter(rule => matcher.nomatchDescendant(node, rule.nomatch_descendant))
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
    if (node.nodeName === 'template') {
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
    // just pretend to be UTF-8
    this.html = normalize(html);

    var errorGenertor = ValidateError.generator({
        html: this.html,
        fast: this.config.fast
    });

    // Encoding Check
    var errors = this.applyErrorPolicy(() => {
        checkUTF8(html, errorGenertor);
        return errorGenertor.errors;
    });
    if (errors.length) {
        // stop continue on Encoding error
        return errors;
    }

    // parse DOM tree
    var document = parse5.parse(this.html, {
        locationInfo: true
    });

    // Apply Validators
    errors = this.applyErrorPolicy(() => {
        behaveBuggyAsTheCPPVersion(document, errorGenertor);
        this.onBegin(errorGenertor);
        this.dfs(document, errorGenertor);
        this.onEnd(errorGenertor);
        return errorGenertor.errors;
    }, this.config.fast);

    return errors;
};

Engine.prototype.applyErrorPolicy = function(validate, fastEnabled) {
    try {
        var errors = validate();
        return fastEnabled ? [] : errors;
    } catch (e) {
        if (fastEnabled) {
            return [e];
        } else {
            throw e;
        }
    }
};

/*
 * @param {String} content The unicode string from file
 * @return {String} The normalized string
 */
function normalize(content) {
    return content.toString().replace(/^\uFEFF/, '');
}

module.exports = function(rules) {
    return new Engine(rules);
};

function behaveBuggyAsTheCPPVersion(doc, errorGenertor){
    try{
        var head = findFirstTagChild(findFirstTagChild(doc));
        if(head.tagName !== 'head') return;

        var noscriptAppeared = false;
        head.childNodes.forEach((node, i) => {
            if(node.tagName === 'noscript'){
                noscriptAppeared = true;
            // it's a tag after noscript
            } else if (node.tagName && noscriptAppeared){
                var err = ERR.INVALID_NOSCRIPT;
                errorGenertor(err);
            }
        });
    } catch(e){
        // let it be...
        console.log('behaveBuggyAsTheCPPVersion error:', e);
    }
};

function findFirstTagChild(parent){
    var ret;
    parent.childNodes.some(node => {
        ret = node;
        return node.tagName;
    });
    return ret;
}
