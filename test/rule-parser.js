const chai = require('./chai.js')
const expect = chai.expect
const ruleParser = require('../src/rule-parser.js')
const customRules = require('../rules-custom.json')

describe('rule-parser', function() {
    describe('.typedRules()', function() {
        it('should retrieve typed rules', function() {
            expect(ruleParser.typedRules('custom')).to.equal(customRules)
        })
        it('should throw when type not defiend', function() {
            expect(function() {
                ruleParser.typedRules('foo')
            }).to.throw(/rules not found for type foo/)
        })
    })
    describe('.normalize()', function() {
        it('should use default rules when not given', function() {
            var ret = ruleParser.normalize()
            expect(ret).to.be.an('object')
        })
    })
})