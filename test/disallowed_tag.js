const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const errorCode = require('../src/error/dfn.json')

describe('disallowed tag', function() {
    var validator, result
    before(function() {
        validator = Validator({
            link: {
                disallow: true
            },
            script: {
                disallow: true,
                match: {
                    type: 'application/javascript'
                }
            },
            frame: {
                disallow: true
            },
            frameset: {
                disallow: true
            },
            '/^foo\\d/': {
                disallow: true
            }
        })
    })
    it('should accept with tag absence', function() {
        result = validator.validate('<p></p>')
        expect(result).to.have.lengthOf(0)
    })
    it('should reject with tag presence', function() {
        result = validator.validate('<link>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(errorCode.DISALLOWED_TAG.code)
        expect(result[0].message).to.equal("禁止使用 '<link>' 标签")
    })
    it('should respect match', function() {
        result = validator.validate('<script>')
        expect(result).to.have.lengthOf(0)
        result = validator.validate('<script type="application/javascript">')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(errorCode.DISALLOWED_TAG.code)
        var msg = "禁止使用 '<script type=\"application/javascript\">' 标签"
        expect(result[0].message).to.equal(msg)
    })
    it('should reject disallowed frame/frameset', function() {
        result = validator.validate('<div><frame></frame><frameset></div>')
        expect(result).to.have.lengthOf(2)
        expect(result[0].message).to.equal("禁止使用 '<frame>' 标签")
        expect(result[1].message).to.equal("禁止使用 '<frameset>' 标签")
    })
    it('should accept frame/frameset when not specified', function() {
        var val = Validator({
            frame: {}
        })
        result = val.validate('<div><frame></frame><frameset></div>')
        expect(result).to.have.lengthOf(0)
    })
    it('should support regex', function() {
        result = validator.validate('<foo0></foo0><foo1></foo1>')
        expect(result).to.have.lengthOf(2)
        expect(result[0].message).to.equal("禁止使用 '<foo0>' 标签")
        expect(result[1].message).to.equal("禁止使用 '<foo1>' 标签")
    })
})