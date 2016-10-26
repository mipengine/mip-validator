const chai = require('./chai.js');
const expect = chai.expect;
const Validator = require('..');
const ERR = require('../src/error.json');

describe('mandatory tag missing', function() {
    var result;
    it('should accept valid mandatory', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        result = validator.validate('<div><img></div>');
        expect(result).to.have.lengthOf(0);
    });
    it('should support attributes', function() {
        var validator = Validator({
            "body": {
                "mandatory": {
                    "mip": '/.*/',
                    "foo": "bar"
                }
            }
        });
        var result = validator.validate('<body mip foo="bar"></body>');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<body></body>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].code).to.equal(ERR.MANDATORY_TAG_MISSING.code);
        var message = "强制性标签'<body mip=\"/.*/\" foo=\"bar\">'缺失或错误";
        expect(result[0].message).to.equal(message);
    });
    it('should support arrays', function() {
        var validator = Validator({
            "link": {
                "mandatory": [{
                    "rel": "standardhtml"
                }, {
                    "rel": "miphtml"
                }]
            }
        });
        var result = validator.validate('<div><link rel="standardhtml"><link rel="miphtml"></div>');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<div><link rel="miphtml"></div>');
        expect(result).to.have.lengthOf(1);
    });
    it('should support OR arrays', function() {
        var validator = Validator({
            "meta": {
                "mandatory_or": [{
                    "http-equiv": "/Content-Type/i",
                    "content": "/charset=utf-8/"
                }, {
                    "charset": "utf-8"
                }]
            }
        });
        var result = validator.validate('<div></div>');
        expect(result).to.have.lengthOf(1);
        result = validator.validate('<meta http-equiv="content-type" content="charset=utf-8">');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<meta charset="utf-8">');
        expect(result).to.have.lengthOf(0);
    });
    it('should reject when mandatory tag missing', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(1);

        var err = ERR.MANDATORY_TAG_MISSING;
        expect(result[0].code).to.equal(err.code);
        var message = "强制性标签'<div>'缺失或错误";
        expect(result[0].message).to.equal(message);
    });
    it('should accept when mandatory false', function() {
        var validator = Validator({
            div: {
                mandatory: false
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept when mandatory not set', function() {
        var validator = Validator({
            div: {}
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should accept when rule not set', function() {
        var validator = Validator({});
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(0);
    });
    it('should produce position info', function() {
        var validator = Validator({
            div: {
                mandatory: true
            }
        });
        var result = validator.validate('<p></p>');
        expect(result).to.have.lengthOf(1);
        expect(result[0].line).to.equal(0);
        expect(result[0].col).to.equal(0);
    });
    it('should validate html/head/body tag', function() {
        var validator = Validator({
            html: {
                mandatory: true
            },
            head: {
                mandatory: true
            },
            body: {
                mandatory: true
            }
        });
        var result = validator.validate('<html><body><head>');
        expect(result).to.have.lengthOf(0);
        result = validator.validate('<div>');
        expect(result).to.have.lengthOf(3);
    });
});
