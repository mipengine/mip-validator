const chai = require('./chai.js');
const expect = chai.expect;
const Validator = require('..');
const errorCode = require('../src/error.json');

describe('disallowed attr', function() {
    var validator, result;
    before(function() {
        validator = Validator({
            img: {
                attrs: {
                    '/^on\\w+$/': {
                        disallow: true
                    },
                    'src': {
                        disallow: true
                    },
                    'foo': {
                        disallow: true,
                        match: {
                            bar: 'bar'
                        }
                    }
                }
            }
        });
    });
    it('should accept with tag absence', function() {
        result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept with attr absence', function() {
        result = validator.validate('<img>');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject with attr presence', function() {
        result = validator.validate('<img src="">');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
        expect(result[0].message).to.equal("'<img>'标签中禁止使用'src'属性");

        result = validator.validate('<img src>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
    });
    it('should respect match', function() {
        // match fail
        result = validator.validate('<img foo bar="zoo">');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<img foo>');
        expect(result).to.have.lengthOf(0);

        // match success
        result = validator.validate('<img foo bar="bar">');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
    });
    it('should support RegExp', function() {
        result = validator.validate('<img onclick="onClick();">');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
    });
    it('should compliant with regex tags', function(){
        var validator = Validator({
            '/.*/': {
                attrs: {
                    'style': {
                        disallow: true,
                    },
                    '/^on.+/': {
                        disallow: true
                    }
                }
            }
        });
        result = validator.validate('<span style>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
        expect(result[0].message).to.equal("'<span>'标签中禁止使用'style'属性");

        result = validator.validate('<span onclick="">');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(errorCode.DISALLOWED_ATTR.code);
        expect(result[0].message).to.equal("'<span>'标签中禁止使用'onclick'属性");
    });
});
