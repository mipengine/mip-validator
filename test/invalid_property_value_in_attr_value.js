const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const ERR = require('../src/error/dfn.json')

describe('invalid property value in attribute value', function() {
    var validator
    before(function() {
        validator = Validator({
            'meta': {
                attrs: {
                    'content': {
                        match: {
                            'name': 'viewport'
                        },
                        properties: {
                            'width': 'device-width',
                            'initial-scale': '1'
                        }
                    }
                }
            },
            'span': {
                attrs: {
                    'content': [{
                        match: {
                            'name': 'foo'
                        },
                        properties: {
                            'width': '1'
                        }
                    }, {
                        match: {
                            'name': 'bar'
                        },
                        properties: {
                            'width': '2'
                        }
                    }]
                }
            }
        })
    })
    it('should accept valid attr value', function() {
        var html = '<meta name="viewport" content="width=device-width,initial-scale=1">'
        var result = validator.validate(html)
        expect(result).to.have.lengthOf(0)
    })
    it('should support array of properties spec', function() {
        var html = '<span name="foo" content="width=1"></span>'
        var result = validator.validate(html)
        expect(result).to.have.lengthOf(0)

        html = '<span name="foo" content="width=2"></span>'
        result = validator.validate(html)
        expect(result).to.have.lengthOf(1)
    })
    it('should reject invalid attr value', function() {
        var html = '<meta name="viewport" content="width=100px,initial-scale=1">'
        var result = validator.validate(html)

        expect(result).to.have.lengthOf(1)

        var err = ERR.INVALID_PROPERTY_VALUE_IN_ATTR_VALUE
        var message = "标签 'meta' 中的属性 'content' 的属性 'width' 被设置为 '100px'，该属性值无效"
        expect(result[0].code).to.equal(err.code)
        expect(result[0].message).to.equal(message)
    })
    it('should reject empty attr value', function() {
        var html = '<meta name="viewport" content="">'
        var result = validator.validate(html)
        expect(result).to.have.lengthOf(2)
    })
    it('should reject with detailed error info', function() {
        var html = '<meta name="viewport" content="width=device-width">'
        var result = validator.validate(html)
        var message = "标签 'meta' 中的属性 'content' 的属性 'initial-scale' 被设置为 ''，该属性值无效"
        expect(result[0].message).to.equal(message)
    })
    it('should respect match', function() {
        var html = '<meta content="width=100px,initial-scale=1">'
        var result = validator.validate(html)
        expect(result).to.have.lengthOf(0)
    })
})