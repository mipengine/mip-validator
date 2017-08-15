const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error/dfn.json')

describe('error', function () {
  var validator, result
  before(function () {
    validator = Validator({
      'img': {
        'attrs': {
          'src': {
            'value': '/^http:///'
          }
        }
      }
    })
    result = validator.validate('<html>\n\n' +
            '  <img src="harttle.com"></img>\n' +
            '</html>')[0]
  })
  it('should contain correct line number', function () {
    expect(result.line).to.equal(3)
  })
  it('should contain correct col number', function () {
    expect(result.col).to.equal(3)
  })
  it('should contain correct offset', function () {
    expect(result.offset).to.equal(10)
  })
  it('should contain correct input string', function () {
    expect(result.input).to.equal('  <img src="harttle.com"></img>')
  })
  it('should contain correct error code', function () {
    expect(result.code).to.equal(ERR.INVALID_ATTR_VALUE.code)
  })
})
