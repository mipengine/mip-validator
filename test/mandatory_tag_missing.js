const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../src/error.json');

describe('mandatory tag missing', function() {
    it('should accept valid mandatory', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        var result = validator.validate('<div><img></div>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject when mandatory tag missing', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(1);

        var err = errorCode.MANDATORY_TAG_MISSING;
        expect(result[0].code).to.equal(err.code);
        var message = "强制性标签 'div' 缺失或错误";
        expect(result[0].message).to.equal(message);
    });

    it('should accept when mandatory not set', function() {
        var validator = Validator({
            div: {}
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept when mandatory false', function() {
        var validator = Validator({
            div: {
                mandatory: false
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept when rule not set', function() {
        var validator = Validator();
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should produce position info', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].line).to.equal(0);
        expect(result[0].col).to.equal(0);
    });
});
