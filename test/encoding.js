const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const asciiStr = 'hello'
const utf8Str = '\xc3\xa0\xc3\xad\xc3\xa0\xc3\xa7\xc3\xa3'

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
})