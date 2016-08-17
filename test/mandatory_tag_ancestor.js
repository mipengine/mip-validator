const env = require('./env.js');
const expect = env.expect;
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
        var message = "标签 'mip-input' 只能是标签 'form' 的子级标签";
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
});

