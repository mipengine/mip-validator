const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error/dfn.json')

describe('duplicate unique tag', function () {
  var validator, result
  before(function () {
    validator = Validator({
      link: {
        duplicate: [{
          rel: 'standardhtml'
        }, {
          rel: 'miphtml'
        }]
      },
      meta: {
        duplicate: {
          viewport: '/.*/'
        }
      },
      div: [{
        duplicate: true,
        match: {
          foo: 'bar'
        }
      }, {
        duplicate: true,
        match: {
          bar: 'foo'
        }
      }]
    })
  })
  it('should accept when no duplicate', function () {
    result = validator.validate('<meta viewport="foo">')
    expect(result).to.have.lengthOf(0)
  })
  it('should reject when duplicate', function () {
    result = validator.validate('<meta viewport="foo"><meta viewport="bar">')
    expect(result).to.have.lengthOf(1)
    result = result[0]
    var err = ERR.DUPLICATE_UNIQUE_TAG
    expect(result.code).to.equal(err.code)
    expect(result.message).to.equal("标签'<meta viewport=\"/.*/\">'只能出现一次")
  })
  it('should support array of duplicate patterns', function () {
    result = validator.validate('<link rel="miphtml">')
    expect(result).to.have.lengthOf(0)
    result = validator.validate('<link rel="miphtml"><link rel="miphtml">')
    expect(result).to.have.lengthOf(1)
  })
  it('should accept when attribute not present', function () {
    result = validator.validate('<link>')
    expect(result).to.have.lengthOf(0)
  })
  it('should support different duplicate patterns', function () {
    result = validator.validate('<link rel="standardhtml"><link rel="miphtml">')
    expect(result).to.have.lengthOf(0)
  })
  it('should validate html/head/body tag', function () {
    var validator = Validator({
      html: {
        duplicate: true
      },
      head: {
        duplicate: true
      },
      body: {
        duplicate: true
      }
    })
    result = validator.validate('<html><body><head><head><body><html>')
    expect(result).to.have.lengthOf(3)
  })
    // it.only('should count correctly for multiple rules per node', function() {
  it('should count correctly for multiple rules per node', function () {
    result = validator.validate('<div foo="bar" bar="foo">')
    expect(result).to.have.lengthOf(0)
  })
})
