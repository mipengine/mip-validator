const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')

describe('mandatory attributes missing', function() {
    var result
    it('valid mandatory attributes or', function() {
        var validator = Validator({
            img: {
                'attrs_or': [{
                    'src': '/^\\S+$/'
                }, {
                    'srcset': '/^\\S+$/'
                }]
            }
        })
        result = validator.validate('<img>')
        expect(result).to.have.lengthOf(1)
    })

    it('invalid mandatory attributes or', function() {
        var validator = Validator({
            img: {
            }
        })
        result = validator.validate('<img>')
        expect(result).to.have.lengthOf(0)
    })
})
