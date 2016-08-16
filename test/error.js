const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../error-code.json');
const zh_cn = require('../i18n/zh_cn.json');

describe('error', function() {
    var validator, result;
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
        result = validator.validate('<html>\n\n' +
            '  <img src="harttle.com"></img>\n' +
            '</html>')[0];
    });
    it('should contain correct line number', function() {
        expect(result.line).to.equal(3);
    });
    it('should contain correct col number', function() {
        expect(result.col).to.equal(3);
    });
    it('should contain correct rule name', function() {
        expect(result.rule).to.equal('src');
    });
    it('should contain correct offset', function() {
        expect(result.offset).to.equal(10);
    });
    it('should contain correct input string', function() {
        expect(result.input).to.equal('  <img src="harttle.com"></img>');
    });
    it('should contain correct error code', function() {
        expect(result.code).to.equal(errorCode.INVALID_ATTR_VALUE);
    });
    it('should contain correct error message', function() {
        expect(result.message).to.equal(zh_cn[errorCode.INVALID_ATTR_VALUE]);
    });
});
