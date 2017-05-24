/*
 * @author harttle<yangjun14@baidu.com>
 * @file match_ancestor testing
 */
const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')

describe('match_ancestor', function () {
  var validator = Validator({
    input: {
      disallow: true,
      match_ancestor: 'form'
    }
  })
  it('should validate when direct ancestor matched', function () {
    var result = validator.validate('<form><input></form>')
    expect(result).to.have.lengthOf(1)
  })
  it('should validate when undirect ancestor matched', function () {
    var result = validator.validate('<form><div><input></div></form>')
    expect(result).to.have.lengthOf(1)
  })
  it('should skip when ancestor not matched', function () {
    var result = validator.validate('<div><input></div>')
    expect(result).to.have.lengthOf(0)
  })
})
