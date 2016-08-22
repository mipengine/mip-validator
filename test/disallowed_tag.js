const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../src/error.json');

describe('disallowed tag', function() {
    var validator;
    before(function() {
        validator = Validator({
            script: {
                disallow: true
            },
            frameset: {
                disallow: true
            }
        });
    });
    it('should accept with tag absence', function() {
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject with tag presence', function() {
        var result = validator.validate('<script></script>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_TAG.code);
    });
    it('should support obsolete tags', function() {
        result = validator.validate('<div><frameset></frameset></div>');
        expect(result).to.have.lengthOf(1);
    });
});
