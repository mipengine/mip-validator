/*
 * @author harttle<yangjun14@baidu.com>
 * @file match_parent testing
 */
const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');

describe('match_parent', function() {
    var validator = Validator({
        input: {
            disallow: true,
            match_parent: 'form'
        }
    });
    it('should validate when parent matched', function() {
        var result = validator.validate('<form><input></form>');
        expect(result).to.have.lengthOf(1);
    });
    it('should skip when parent not matched', function() {
        var result = validator.validate('<div><input></div>');
        expect(result).to.have.lengthOf(0);
    });
    it('should skip when parent not matched, while ancestor matched', function() {
        result = validator.validate('<form><div><input></div></form>');
        expect(result).to.have.lengthOf(0);
    });
});
