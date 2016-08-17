const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../src/error-code.json');
const zh_cn = require('../i18n/zh_cn.json');

describe('invalid attr value', function() {
    var validator;
    before(function() {
        validator = Validator({
            "img": {
                "attrs": {
                    "src": {
                        "value": "^http://"
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
        expect(result.line).to.equal(3);
    });
});
