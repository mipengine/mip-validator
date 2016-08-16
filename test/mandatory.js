const env = require('./env.js');
const expect = env.expect;
const Validator = require('..');
const errorCode = require('../error-code.json');

describe('mandatory', function() {
    describe('tag', function() {
        it('should accept valid mandatory', function() {
            var validator = Validator({
                div: {
                    mandatory: true
                }
            });
            var result = validator.validate('<div><img></div>');
            expect(result).to.have.lengthOf(0);
        });
        it('should reject invalid mandatory', function() {
            var validator = Validator({
                div: {
                    mandatory: true
                }
            });
            var result = validator.validate('<p></p>');
            expect(result).to.have.lengthOf(1);
            expect(result[0].code).to.equal(errorCode.TAG_MISSING);
        });

        it('should accept when mandatory not set', function() {
            var validator = Validator({
                div: {}
            });
            var result = validator.validate('<p></p>');
            expect(result).to.have.lengthOf(0);
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
        it('should accept when rule not set', function() {
            var validator = Validator();
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
    });

    describe('attr', function() {
        var validator;
        before(function() {
            validator = Validator({
                div: {
                    attrs: {
                        id: {
                            mandatory: true
                        }
                    }
                }
            });
        });
        it('should accept valid attr mandatory', function() {
            var result = validator.validate('<div id="foo"></div>');
            expect(result).to.have.lengthOf(0);
        });
        it('should reject invalid attr mandatory', function() {
            var result = validator.validate('<div></div>');
            expect(result).to.have.lengthOf(1);
            expect(result[0].code).to.equal(errorCode.ATTR_MISSING);
        });
        it('should accept when no tag presence', function() {
            var result = validator.validate('<p></p>');
            expect(result).to.have.lengthOf(0);
        });
    });
});
