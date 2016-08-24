const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../src/error.json');

describe('disallowed tag', function() {
    var validator, result;
    before(function() {
        validator = Validator({
            script: {
                disallow: true
            },
            frame: {
                disallow: true
            },
            frameset: {
                disallow: true
            }
        });
    });
    it('should accept with tag absence', function() {
        result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject with tag presence', function() {
        result = validator.validate('<script></script>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_TAG.code);
        expect(result[0].message).to.equal("禁止使用'script'标签");
    });
    it('should support frame/frameset', function() {
        result = validator.validate('<div><frame></frame><frameset></div>');
        expect(result).to.have.lengthOf(2);
        expect(result[0].message).to.equal("禁止使用'frame'标签");
    });
});
