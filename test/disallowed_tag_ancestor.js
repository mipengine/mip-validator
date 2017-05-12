const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error.json')

describe('disallowed tag ancestor', function () {
  var validator
  before(function () {
    validator = Validator({
      div: {
        disallowed_ancestor: 'span'
      },
      form: {
        disallowed_ancestor: ['span', 'a']
      }
    })
  })
  it('should accept when ancestor not matched', function () {
    var result = validator.validate('<form><div></div></form>')
    expect(result).to.have.lengthOf(0)
  })
  it('should reject when parent matched', function () {
    var result = validator.validate('<span><div></div></span>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG_ANCESTOR.code)
    expect(result[0].message).to.equal("标签'div'不应该是标签'span'的子标签")
  })
  it('should reject when grandfather matched', function () {
    var result = validator.validate('<span><section><div></div></section></span>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG_ANCESTOR.code)
  })
  it('should support array of ancestors', function () {
    var result = validator.validate('<span><form></form></span>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG_ANCESTOR.code)

    result = validator.validate('<a><form></form></a>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG_ANCESTOR.code)
  })
})
