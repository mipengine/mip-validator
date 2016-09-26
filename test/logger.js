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
            expect(logger.log('bar')).to.match(/\[foo\] bar$/);
        });
        it('should prefix with timestamp', function() {
            var datetime = /^\[\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}:\d{2}\]/;
            expect(logger.log('bar')).to.match(datetime);
        });
    });
});
