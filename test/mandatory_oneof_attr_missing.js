const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../src/error.json');

describe('mandatory oneof attr missing', function() {
    var validator;
    before(function() {
        validator = Validator({
            div: {
                attrs: {
                    id: {
                        mandatory: true
                    }
                }
            }
        });
    });
    it('should accept valid attr mandatory', function() {
        var result = validator.validate('<div id="foo"></div>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject invalid attr mandatory', function() {
        var result = validator.validate('<div></div>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.MANDATORY_ONEOF_ATTR_MISSING.code);
    });
    it('should accept when no tag presence', function() {
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept when no tag presence', function() {
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
//标签'xx'的强制性属性'xx'缺失
    });
});
