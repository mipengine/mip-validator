const chai = require('./chai.js');
const expect = chai.expect;
const Validator = require('..');
const ERR = require('../src/error.json');

describe('mandatory tag ancestor', function() {
    var validator;
    before(function() {
        validator = Validator({
            'mip-input': {
                mandatory_ancestor: "form"
            }
        });
    });
    it('should reject when ancestor not matched', function(){
        var result = validator.validate('<span><mip-input></mip-input></span>');
        var code = ERR.MANDATORY_TAG_ANCESTOR.code;
        var message = "标签'mip-input'只能是标签'form'的子级标签";
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(code);
        expect(result[0].message).to.equal(message);
    });
    it('should accept if parent matched', function() {
        var result = validator.validate('<form><mip-input></mip-input></form>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept it grandfather matched', function() {
        var result = validator.validate('<form><a><mip-input></mip-input></a></form>');
        expect(result).to.have.lengthOf(0);
    });
    it('should validate ancestor of noscript', function() {
        var validator = Validator({
            'noscript': {
                mandatory_ancestor: 'body'
            }
        });
        var result = validator.validate('<head><noscript></noscript></head>');
        expect(result).to.have.lengthOf(1);
        var result = validator.validate('<body><noscript></noscript></body>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject <noscript> if not the last of <head>', function() {
        var validator = Validator({});
        var result = validator.validate('<head><noscript></noscript><link></head>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal('06201001');
    });
    it('should accept <noscript> as the last element of <head>', function() {
        var validator = Validator({});
        var result = validator.validate('<head><noscript></noscript> foo </head>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept <noscript> as the last child of <head>', function() {
        var validator = Validator({});
        var result = validator.validate('<head><link><noscript></noscript></head>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept <noscript> as child of <body>', function() {
        var validator = Validator({});
        var result = validator.validate('<body><input><noscript></noscript></body>');
        expect(result).to.have.lengthOf(0);
    });
});

