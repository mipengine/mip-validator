const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const asciiStr = 'hello'
const ERR = require('../src/error/dfn.json')
const utf8Str = '\xc3\xa0\xc3\xad\xc3\xa0\xc3\xa7\xc3\xa3'
const big5Str = '\xa6\xb8\xb1\x60\xa5\xce\xb0\xea\xa6\x72\xbc\xd0\xb7\xc7\xa6\x72\xc5\xe9\xaa\xed'

describe('encoding', function() {
    it('should accept ASCII', function() {
        var validator = Validator({})
        var result = validator.validate(asciiStr)
        expect(result).to.have.lengthOf(0)
    })
    it('should accept UTF-8', function() {
        var validator = Validator({})
        var result = validator.validate(utf8Str)
        expect(result).to.have.lengthOf(0)
    })
    it('should reject Big5', function () {
        var validator = Validator({})
        var result = validator.validate(big5Str)
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(ERR.DISALLOWED_ENCODING.code)
    })
})