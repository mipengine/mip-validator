const chai = require('./chai.js');
const expect = chai.expect;
const Validator = require('..');
const ERR = require('../src/error.json');
const big5Str = "\xa6\xb8\xb1\x60\xa5\xce\xb0\xea\xa6\x72\xbc\xd0\xb7\xc7\xa6\x72\xc5\xe9\xaa\xed";
const asciiStr = 'hello';
const utf8Str = '\xc3\xa0\xc3\xad\xc3\xa0\xc3\xa7\xc3\xa3';
const gbkStr = '\xd5\xe2\xb7\xdd\xb4\xfa\xc2\xeb\xb5\xc4\xd7\xf7\xd5\xdf\xca\xc7\x20\x48\x61\x72\x74\x74\x6c\x65\x0d\x0a';

describe('encoding', function() {
    it('should accept ASCII', function() {
        var validator = Validator({});
        var result = validator.validate(asciiStr);
        expect(result).to.have.lengthOf(0);
    });
    it('should accept UTF-8', function() {
        var validator = Validator({});
        var result = validator.validate(utf8Str);
        expect(result).to.have.lengthOf(0);
    });
    it('should reject gbk', function() {
        var validator = Validator({});
        var result = validator.validate(gbkStr);
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(ERR.DISALLOWED_ENCODING.code);
    });
});

