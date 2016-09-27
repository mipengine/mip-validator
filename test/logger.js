/*
 * @author harttle<yangjun14@126.com>
 * @file logger it's hard to mock console without effect Mocha,
 *              maybe the console object should be injected as 
 *              a constructor parameter.
 */
const env = require('./env.js');
const expect = env.expect;
const Logger = require('../src/Logger.js');

describe('Logger', function() {
    it('should throw when id undefined', function() {
        function fn() {
            Logger();
        }
        expect(fn).to.throw();
    });
    it('should not throw when id defined', function() {
        function fn() {
            Logger('foo');
        }
        expect(fn).to.not.throw();
    });
    describe('log', function() {
        var logger = Logger('foo');

        it('should prefix with id', function() {
            expect(logger.log('bar')).to.contain('[foo] bar');
        });
        it('should prefix with timestamp', function() {
            var datetime = /^\[\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}:\d{2}\]/;
            expect(logger.log('bar')).to.match(datetime);
        });
        it('should support multiple args', function() {
            expect(
                logger.log('bar', false, {
                    foo: 'foo'
                })
            ).to.contain('[foo] bar false [object Object]');
        });
        it('should handle non-string first arg', function() {
            expect(logger.log(false, 'bar')).to.contain('false bar');
        });
        it('should handle falsy values', function() {
            expect(logger.log(false, null, undefined)).to
                .contain('false null undefined');
        });
        it('should support format string: %s', function() {
            expect(logger.log("%s", 'foo', 'bar')).to.contain('foo bar');
        });
        it('should support format string: %d', function() {
            expect(logger.log("%d", '3')).to.contain('3');
            expect(logger.log("%d", 'foo')).to.contain('NaN');
        });
        it('should support format string: %j', function() {
            expect(logger.log("before%jafter", {
                foo: 'bar'
            })).to.contain('before{"foo":"bar"}after');
        });
        it('should support format string: %J', function() {
            expect(logger.log("before%Jafter", {
                foo: 'bar'
            })).to.contain('before\n{\n    "foo": "bar"\n}\nafter');
        });
    });
    describe('debug', function() {
        var debugEnv;
        before(function() {
            debugEnv = process.env.DEBUG;
        });
        after(function() {
            process.env.DEBUG = debugEnv;
        });

        it('should output none when DEBUG=""', function() {
            process.env.DEBUG = '';
            var logger = Logger('foo');
            expect(logger.debug('bar')).to.equal(false);
        });

        it('should output when DEBUG==id exactly', function() {
            process.env.DEBUG = 'foo';
            var logger = Logger('foo');
            expect(logger.debug('bar')).to.contain('[foo] bar');
        });
        it('should output when DEBUG prefix matched', function() {
            process.env.DEBUG = 'foo';
            var logger = Logger('foo:bar');
            expect(logger.debug('bar')).to.contain('[foo:bar] bar');
        });
        it('should output when DEBUG prefix not matched', function() {
            process.env.DEBUG = 'foo:foo';
            var logger = Logger('foo:bar');
            expect(logger.debug('bar')).to.equal(false);
        });
    });
});
