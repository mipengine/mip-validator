/**
 * @file engine The MIP validation engine
 * @author harttle<yangjvn@126.com>
 */

const parse5 = require('parse5')
const _ = require('lodash')
const matcher = require('./matcher.js')
const ValidateError = require('./validate-error.js')
const logger = require('./logger.js')('mip-validator:engine')
const ERR = require('./error.json')
const checkUTF8 = require('./encoding.js').checkUTF8
const ruleParser = require('../src/rule-parser.js')
const assert = require('assert')

/**
 * The validation engine constructor
 *
 * @class
 * @param {Object} rules plain object configuring rules to validate with
 */
function Engine (rules) {
  this.onBeginCbs = []
  this.onEndCbs = []
  this.onAttrCbs = []
  this.onNodeCbs = []
  this.setRules(rules)
}

Engine.prototype.setRules = function (rules) {
  assert(_.isObject(rules),
    'rules object expected, but ' + (typeof rules) + ' found')
  this.config = ruleParser.mkConfig(rules)
}

Engine.prototype.register = function (validator) {
  validator.onBegin && this.onBeginCbs.push(validator.onBegin)
  validator.onEnd && this.onEndCbs.push(validator.onEnd)
  validator.onNode && this.onNodeCbs.push(validator.onNode)
  validator.onAttr && this.onAttrCbs.push(validator.onAttr)
}

/**
 * Callback when DFS begins
 *
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.onBegin = function (error) {
  logger.debug('onBegin')
  _.map(this.onBeginCbs, cb => cb(error, this))
}

/*
 * Callback when DFS found a Node
 * @param {ASTNode}  node   the node currently found, see:
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {Function} error  errorFactory to create an error.
 */
Engine.prototype.onNode = function (node, error) {
  logger.debug('onNode', node.nodeName)
    // get active rules
  var rules = _.chain(this.config.regexNodes)
        .filter((rules) => matcher.matchValue(node.nodeName, rules.regexStr))
        .flatten()
        .concat(this.config.nodes[node.nodeName] || [])
        .filter(rule => matcher.matchAttrs(node, rule.match))
        .filter(rule => matcher.matchParent(node, rule.match_parent))
        .filter(rule => matcher.matchAncestor(node, rule.match_ancestor))
        .value()

  _.forEach(rules, nodeRule => {
        // invoke callbacks
    _.map(this.onNodeCbs, cb => {
      cb(node, nodeRule, nodeError, this)
    })
        // traverse attributes
    _.forEach(node.attrs, attr => this.onAttr(attr, node, nodeRule, nodeError))
  })

    // error generator
  function nodeError (e) {
    e.location = node.__location
    error.apply(null, arguments)
  }
}

/*
 * Callback when DFS found an attribute
 * @param {ASTAttribute} attribute the attribute currently found
 *     https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/parse5
 * @param {ASTNode}      node the parent node
 * @param {Object}       nodeRule rule config object for the node
 * @param {Function}     error  errorFactory to create an error
 */
Engine.prototype.onAttr = function (attr, node, nodeRule, error) {
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
    _.map(this.onAttrCbs, cb => cb(attr, rule, node, nodeRule, error, this))
  })
}

/*
 * Callback when DFS ends
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.onEnd = function (error) {
  logger.debug('onEnd')
  _.map(this.onEndCbs, cb => cb(error, this))
}

/*
 * Do a DFS for the node
 * @param {ASTNode}  node the root node to dfs with
 * @param {Function} error errorFactory to create an error.
 */
Engine.prototype.dfs = function (node, error) {
  if (node.nodeName === 'template') {
    logger.debug('<template> encountered')
    node.childNodes = node.content.childNodes
    node.childNodes.forEach(child => (child.parentNode = node))
  }

  this.onNode(node, error)
  var children = node.childNodes || []
  children.forEach(child => this.dfs(child, error))
}

/**
 * Validate the HTML
 *
 * @param {string} html The HTML to validate.
 * @param {Boolean} options.fastMode Optional, abort on first error, default false.
 * @param {Object} options.rules Optional, the rules to validate the `html` with, first initialized in constructor
 * @param {string} options.type Optional, the sub type of MIP document, e.g. "custom"
 */
Engine.prototype.validate = function (html, options) {
  this.html = normalize(html)
  options = _.assign({
    fastMode: false,
    rules: undefined,
    type: undefined
  }, options)

  logger.debug('validating using options %J', options)

  return useErrorPolicy(() => {
    var errorGenertor = ValidateError.generator({
      html: this.html,
      fast: options.fastMode
    })

    checkUTF8(html, errorGenertor)
    var document = parse(this.html, options)
    behaveBuggyAsTheCPPVersion(document, errorGenertor)
    this.validateDocument(document, errorGenertor)
    if (options.type) {
      this.validateTypedDocument(document, errorGenertor, options.type)
    }

    return errorGenertor.errors
  }, options.fastMode)
}

Engine.prototype.validateTypedDocument = function (document, errorGenertor, type) {
  var rules = ruleParser.typedRules(type)
  this.setRules(rules)

  return this.validateDocument(document, errorGenertor)
}

Engine.prototype.validateDocument = function (document, errorGenertor) {
  this.onBegin(errorGenertor)
  this.dfs(document, errorGenertor)
  this.onEnd(errorGenertor)
}

function parse (html, options) {
  return parse5.parse(html, {
    locationInfo: !options.fastMode
  })
}

function useErrorPolicy (validate, fastMode) {
  if (!fastMode) {
    return validate()
  }
  try {
    validate()
    return []
  } catch (e) {
    return [e]
  }
}

/*
 * @param {String} content The unicode string from file
 * @return {String} The normalized string
 */
function normalize (content) {
  return content.toString().replace(/^\uFEFF/, '')
}

module.exports = function (rules) {
  return new Engine(rules)
}

function behaveBuggyAsTheCPPVersion (doc, errorGenertor) {
  var head = findFirstTagChild(findFirstTagChild(doc))
  var noscriptAppeared = false

  head.childNodes.forEach((node) => {
    if (node.tagName === 'noscript') {
      noscriptAppeared = true
    } else if (node.tagName && noscriptAppeared) {
      // it's a tag after noscript
      var err = ERR.INVALID_NOSCRIPT
      errorGenertor(err)
    }
  })
}

function findFirstTagChild (parent) {
  var ret
  parent.childNodes.some(node => {
    ret = node
    return node.tagName
  })
  return ret
}
