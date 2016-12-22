const chai = require('./chai.js');
const expect = chai.expect;
const Validator = require('..');
const ERR = require('../src/error.json');

describe('template content validation', function() {
    var result;
    it('should validate mandatory tag missing', function() {
        var validator = Validator({
            input: {
                mandatory: true
            }
        });
        var result = validator.validate('<template><input></template>');
        expect(result).to.have.lengthOf(1);
    });
    it('should not throw for empty template', function() {
        var validator = Validator({});
        var result = validator.validate('<template></template>');
        expect(result).to.have.lengthOf(0);
    });
});

