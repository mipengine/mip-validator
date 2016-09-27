const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');

describe('match', function() {
    var validator = Validator({
        div: [{
            duplicate: true,
            match: {
                foo: 'bar'
            }
        }]
    });
    it('should validate when matched', function() {
        var result = validator.validate('<div foo="bar"><div foo="bar">');
        expect(result).to.have.lengthOf(1);
    });
    it('should skip when not matched', function() {
        var result = validator.validate('<div foo="bar"><div>');
        expect(result).to.have.lengthOf(0);
    });
});
