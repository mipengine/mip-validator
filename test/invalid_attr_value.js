const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');

describe('invalid attribute value', function() {
    var validator;
    before(function() {
        validator = Validator({
            "img": {
                "attrs": {
                    "src": {
                        "value": "/^http:///"
                    }
                }
            }
        });
    });
    it('should accept valid attr value', function() {
        var result = validator.validate('<img src="http://harttle.com"></img>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject invalid attr value', function() {
        var result = validator.validate('<img src="harttle.com"></img>');
        expect(result).to.have.lengthOf(1);
    });
    it('should produce detailed error info', function() {
        var result = validator.validate('<html>\n\n' +
            '  <img src="harttle.com"></img>\n' +
            '</html>')[0];
        var message = "标签'img'中的属性'src'的属性值'harttle.com'无效";
        expect(result.line).to.equal(3);
        expect(result.message).to.equal(message);
    });
});
