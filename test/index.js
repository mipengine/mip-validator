const chai = require('./chai.js')
const expect = chai.expect
const sinon = require('sinon')
const Validator = require('..')
const ruleParser = require('../src/rule-parser.js')

describe('index', function () {
  var result, validator
  it('should respect rules config', function () {
    validator = Validator({})
    result = validator.validate('<html></html>')
    expect(result).to.have.lengthOf(0)
  })
  it('should use default rules when not set', function () {
    validator = Validator()
    result = validator.validate('<html></html>')
    expect(result).to.have.length.above(0)
  })
  it('should export default rules', function () {
    var rules = Validator.rules
    expect(rules).to.be.an('object')
  })
  it('should return the first error only in fast mode', function () {
    validator = Validator(null)
    result = validator.validate('<html></html>', {fastMode: true})
    expect(result).to.have.lengthOf(1)
  })
  describe('typed document', function () {
    before(function () {
      sinon.stub(ruleParser, 'typedRules', function () {
        return {
          div: { 'mandatory': true }
        }
      })
    })
    after(function () {
      ruleParser.typedRules.restore()
    })
    it('should validate valid mip-custom', function () {
      validator = Validator({})
      result = validator.validate('<html><div></div></html>', {type: 'custom'})
      expect(result).to.have.lengthOf(0)
    })
    it('should validate invalid mip-custom', function () {
      validator = Validator({})
      result = validator.validate('<html></html>', {type: 'custom'})
      expect(result).to.have.lengthOf(1)
      expect(result[0]).to.have.property('message', "强制性标签'<div>'缺失或错误")
    })
  })
})
