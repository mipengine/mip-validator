const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error/dfn.json')

describe('mandatory tag parent', function() {
    var validator
    before(function() {
        validator = Validator({
            'mip-input': {
                mandatory_parent: 'form'
            }
        })
    })
    it('should reject when parent not matched', function() {
        var result = validator.validate('<span><mip-input></mip-input></span>')
        var code = ERR.WRONG_PARENT_TAG.code
        var message = "标签 'mip-input' 的直接父标签应该是 'form'，而不是 'span'"
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(code)
        expect(result[0].message).to.equal(message)
    })
    it('should accept if parent matched', function() {
        var result = validator.validate('<form><mip-input></mip-input></form>')
        expect(result).to.have.lengthOf(0)
    })
})