const chai = require('./chai.js')
const expect = chai.expect
const Validator = require('..')
const errorCode = require('../src/error/dfn.json')

describe('invalid inner HTML', function () {
    var validator
    var code = errorCode.INVALID_INNER_HTML.code
    before(function () {
        validator = Validator({
            header: {
                inner_html: 'foo'
            },
            footer: {
                inner_html: '/^foo/'
            },
            div: {
                inner_html: '/^foo.*>$/'
            },
            style: {
                inner_html: '!/position:\\s*fixed/'
            }
        })
    })
    it('should accept if matches string', function () {
        var result = validator.validate('<header>foo</header>')
        expect(result).to.have.lengthOf(0)
    })
    it('should reject if does not match string', function () {
        var result = validator.validate('<header></header>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(code)
        expect(result[0].message).to.contain("标签 'header' 的 HTML 内容不合法")
    })
    it('should accept if matches regexp', function () {
        var result = validator.validate('<footer>foobar</footer>')
        expect(result).to.have.lengthOf(0)
    })
    it('should reject if does not match regexp', function () {
        var result = validator.validate('<footer>barfoo</footer>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(code)
        expect(result[0].message).to.contain("标签 'footer' 的 HTML 内容不合法")
    })
    it('should validate child tags', function () {
        var result = validator.validate('<div>foo<span>bar</span></div>')
        expect(result).to.have.lengthOf(0)
        result = validator.validate('<div>foo<span>bar</span>foo</div>')
        console.log(result)
        expect(result).to.have.lengthOf(1)
    })
    it('should support negative match 0', function () {
        var result = validator.validate('<style>foo</style>')
        expect(result).to.have.lengthOf(0)
    })
    it('should support negative match 1', function () {
        var result = validator.validate('<style>position:fixed</style>')
        expect(result).to.have.lengthOf(1)
        expect(result[0].code).to.equal(code)
        expect(result[0].message).to.contain("标签 'style' 的 HTML 内容不合法")
    })
})
