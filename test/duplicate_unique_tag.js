const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const ERR = require('../src/error.json');

describe('duplicate unique tag', function() {
    var validator;
    before(function() {
        validator = Validator({
            link: {
                duplicate: [{
                    rel: "^standardhtml$"
                }, {
                    rel: "^miphtml$"
                }]
            },
            meta: {
                duplicate: [{
                    viewport: ".*"
                }]
            }
        });
    });
    it('should accept when no duplicate', function() {
        var result = validator.validate('<link rel="miphtml">');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject when duplicate', function() {
        var result = validator.validate('<link rel="miphtml"><link rel="miphtml">');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(ERR.DUPLICATE_UNIQUE_TAG.code);
    });
    it('should accept with different duplicate pattern', function() {
        var result = validator.validate('<link rel="standardhtml"><link rel="miphtml">');
        expect(result).to.have.lengthOf(0);
    });
});
