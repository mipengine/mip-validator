const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const errorCode = require('../src/error.json')

describe('mandatory oneof attr missing', function () {
  var validator
  before(function () {
    validator = Validator({
      div: {
        attrs: {
          id: {
            mandatory: true
          }
        }
      },
      span: {
        attrs: {
          id: {
            mandatory: true,
            match: {
              style: 'none'
            }
          }
        }
      },
      script: {
        attrs: {
          src: {
            mandatory: true,
            match: {
              type: 'text/javascript'
            }
          }
        }
      }
    })
  })
  it('should accept valid attr mandatory', function () {
    var result = validator.validate('<div id="foo"></div>')
    expect(result).to.have.lengthOf(0)
  })
  it('should reject invalid mandatory attr', function () {
    var result = validator.validate('<div></div>')
    expect(result).to.have.lengthOf(1)
    var err = errorCode.MANDATORY_ONEOF_ATTR_MISSING
    expect(result[0].code).to.equal(err.code)
    expect(result[0].message).to.equal("标签'div'的强制性属性'id'缺失")
  })
  it('should accept when no tag presence', function () {
    var result = validator.validate('<p></p>')
    expect(result).to.have.lengthOf(0)
  })
  it('should accept when no tag presence', function () {
    var result = validator.validate('<p></p>')
    expect(result).to.have.lengthOf(0)
  })
  it('should respect match', function () {
    var result = validator.validate('<span></span>')
    expect(result).to.have.lengthOf(0)
    result = validator.validate('<span style="none"></span>')
    expect(result).to.have.lengthOf(1)
  })
  it('should support script[type=text/javascript]', function () {
    var result = validator.validate('<script>')
    expect(result).to.have.lengthOf(0)
    result = validator.validate('<script type="text/javascript">')
    expect(result).to.have.lengthOf(1)
  })
})
