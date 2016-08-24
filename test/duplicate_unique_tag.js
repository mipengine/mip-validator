const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const ERR = require('../src/error.json');

describe('duplicate unique tag', function() {
    var validator, result;
    before(function() {
        validator = Validator({
            link: {
                duplicate: [{
                    rel: "standardhtml"
                }, {
                    rel: "miphtml"
                }]
            },
            meta: {
                duplicate: {
                    viewport: "/.*/"
                }
            }
        });
    });
    it('should accept when no duplicate', function(){
        result = validator.validate('<meta viewport="foo">');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject when duplicate', function() {
        result = validator.validate('<meta viewport="foo"><meta viewport="bar">');
        expect(result).to.have.lengthOf(1);
        result = result[0];
        var err = ERR.DUPLICATE_UNIQUE_TAG;
        expect(result.code).to.equal(err.code);
        expect(result.message).to.equal("标签'meta'只能出现一次");
    });
    it('should support array of duplicate patterns', function() {
        result = validator.validate('<link rel="miphtml">');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<link rel="miphtml"><link rel="miphtml">');
        expect(result).to.have.lengthOf(1);
    });
    it('should accept when attribute not present', function() {
        result = validator.validate('<link>');
        expect(result).to.have.lengthOf(0);
    });
    it('should support different duplicate patterns', function() {
        result = validator.validate('<link rel="standardhtml"><link rel="miphtml">');
        expect(result).to.have.lengthOf(0);
    });
    it('should validate html/head/body tag', function() {
        var validator = Validator({
            html: {
                duplicate: true
            },
            head: {
                duplicate: true
            },
            body: {
                duplicate: true
            }
        });
        result = validator.validate('<html><body><head><head><body><html>');
        expect(result).to.have.lengthOf(3);
    });
});
