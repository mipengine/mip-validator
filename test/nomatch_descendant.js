/*
 * @author harttle<yangjun14@baidu.com>
 * @file match_descendant testing
 */
const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const error = require('../src/error/dfn.json')

describe('nomatch_descendant', function() {
    var validator = Validator({
        video: {
            attrs: {
                src: {
                    mandatory: true,
                    nomatch_descendant: 'source'
                }
            }
        }
    })
    it('should validate when nomatch', function() {
        var result = validator.validate('<video></video>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(error.MANDATORY_ONEOF_ATTR_MISSING.code)
        result = validator.validate('<video src></video>')
        expect(result).to.have.lengthOf(0)
    })
    it('should not validate when direct descendant matched', function() {
        var result = validator.validate('<video><source></video>')
        expect(result).to.have.lengthOf(0)
    })
    it('should not validate when undirect descendant matched', function() {
        var result = validator.validate('<video><div><source></div></video>')
        expect(result).to.have.lengthOf(0)
    })
})