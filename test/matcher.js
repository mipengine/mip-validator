const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const matcher = require('../src/matcher')
const parse5 = require('parse5')

describe('match', function () {
  var validator = Validator({
    div: [{
      duplicate: true,
      match: {
        foo: 'bar'
      }
    }]
  })
  it('should validate when matched', function () {
    var result = validator.validate('<div foo="bar"><div foo="bar">')
    expect(result).to.have.lengthOf(1)
  })
  it('should skip when not matched', function () {
    var result = validator.validate('<div foo="bar"><div>')
    expect(result).to.have.lengthOf(0)
  })
})

describe('match_parent', function () {
  it('should work when parent not exist', function () {
    var val = Validator({
      html: {
        disallow: true,
        match_parent: 'form'
      }
    })
    var result = val.validate('<html></html>')
    expect(result).to.have.lengthOf(0)
  })
})

describe('.matchTagNames()', function () {
  it('should match multiple tag names', function () {
    var result = matcher.matchTagNames(['html', 'body'], '<html><body>foo')
    expect(result).to.deep.equal(['<html>', '<body>'])
  })
  it('should return an instance of Array event not match', function () {
    var result = matcher.matchTagNames(['div'], '<html><body>foo')
    expect(result).to.have.lengthOf(0)
  })
  it('should return an instance of Array event string not defined', function () {
    var result = matcher.matchTagNames(['html', 'body'], undefined)
    expect(result).to.have.lengthOf(0)
  })
})

describe('.matchDescendant()', function () {
  var html = parse5.parse('<div><p></p></div>').childNodes[0]

  it('should return true when node name not given', function () {
    expect(matcher.matchDescendant(html, undefined)).to.equal(true)
  })
  it('should return true when node exist', function () {
    expect(matcher.matchDescendant(html, 'p')).to.equal(true)
  })
  it('should return false when node not exist', function () {
    expect(matcher.matchDescendant(html, 'span')).to.equal(false)
  })
})
