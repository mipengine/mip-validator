const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')

describe('ignore tag', function() {
    var validator, result

    it('should igore template tag', function() {
        validator = Validator({
            template: {
                ignore: true
            },
            a: {
                disallow: true
            }
        })
        result = validator.validate('<template><a></a></template>')
        expect(result).to.have.lengthOf(0)
    })
    it('should not igore template tag', function() {
        validator = Validator({
            a: {
                disallow: true
            }
        })
        result = validator.validate('<template><a></a></template>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].message).to.equal("禁止使用 '<a>' 标签")
    })
})
