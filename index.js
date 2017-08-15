const _ = require('lodash')
const Engine = require('./src/engine.js')
const defaultRules = require('./rules.json')
const rulesCustom = require('./rules-custom.json')
const logger = require('./src/logger.js')('mip-validator:index')

function engineFactory (rules) {
  // NPM compliance
  if (rules === 'package.json') {
    return require('./package.json')
  }
  var engine = new Engine(rules || defaultRules)

  // attr
  engine.register(require('./src/validators/disallowed_attr.js'))
  engine.register(require('./src/validators/mandatory_oneof_attr_missing.js'))
  engine.register(require('./src/validators/invalid_attr_value.js'))
  engine.register(require('./src/validators/invalid_property_value_in_attr_value.js'))

  // tag
  engine.register(require('./src/validators/disallowed_tag.js'))
  engine.register(require('./src/validators/duplicate_unique_tag.js'))
  engine.register(require('./src/validators/mandatory_tag_missing.js'))
  engine.register(require('./src/validators/invalid_inner_html.js'))

  // nesting
  engine.register(require('./src/validators/disallowed_tag_ancestor.js'))
  engine.register(require('./src/validators/mandatory_tag_ancestor.js'))
  engine.register(require('./src/validators/mandatory_tag_parent.js'))
  return engine
}

// make a separate copy of rules
engineFactory.rules = _.cloneDeep(defaultRules)
engineFactory.rulesCustom = _.cloneDeep(rulesCustom)

module.exports = engineFactory
