const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error.json')

describe('template content validation', function () {
  it('should validate mandatory tag missing', function () {
    var validator = Validator({
      input: {
        mandatory: true
      }
    })
    var result = validator.validate('<template><input></template>')
    expect(result).to.have.lengthOf(0)
  })
  it('should validate not allowed tag', function () {
    var validator = Validator({
      img: {
        disallow: true
      }
    })
    var result = validator.validate('<html><body><template><img></template></body></html>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG.code)
  })
  it('should not throw for empty template', function () {
    var validator = Validator({})
    var result = validator.validate('<template></template>')
    expect(result).to.have.lengthOf(0)
  })
  it('should validate disallowed_tag_ancestor', function () {
    var validator = Validator({
      script: {
        disallowed_ancestor: 'template'
      }
    })
    var result = validator.validate('<template><script></script></template>')
    expect(result).to.have.lengthOf(1)
    expect(result[0].code).to.equal(ERR.DISALLOWED_TAG_ANCESTOR.code)
  })
})
