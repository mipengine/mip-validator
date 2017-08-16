const _ = require('lodash')
const Walker = require('./walker.js')
const assert = require('assert')
const ERR = require('./error/dfn.json')
const ruleParser = require('./rule-parser.js')
const parse5 = require('parse5')
const logger = require('./logger.js')('mip-validator:engine')
const checkUTF8 = require('./encoding').checkUTF8
const ValidateError = require('./error/validation-error.js')

function Engine (rules) {
  assert(_.isObject(rules), `rules must be object, ${typeof rules} found`)

  var config = ruleParser.mkConfig(rules)
  this.walker = Walker(config)
}

Engine.prototype.register = function (validator) {
  return this.walker.register(validator)
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
  html = normalize(html)
  options = _.assign({
    fastMode: false,
    rules: undefined,
    type: undefined
  }, options)

  logger.debug('validating using options %J', options)

  return useErrorPolicy(() => {
    var errorGenertor = ValidateError.generator({
      html: html,
      fast: options.fastMode
    })

    checkUTF8(html, errorGenertor)
    var document = parse(html, options)
    behaveBuggyAsTheCPPVersion(document, errorGenertor)
    this.walker.validate(document, errorGenertor, html)
    if (options.type) {
      var rules = ruleParser.typedRules(options.type)
      this.walker.config = ruleParser.mkConfig(rules)
      this.walker.validate(document, errorGenertor, html)
    }

    return errorGenertor.errors
  }, options.fastMode)
}

/*
 * @param {String} content The unicode string from file
 * @return {String} The normalized string
 */
function normalize (content) {
  return content.toString().replace(/^\uFEFF/, '')
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

function parse (html, options) {
  return parse5.parse(html, {
    locationInfo: !options.fastMode
  })
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

module.exports = Engine
