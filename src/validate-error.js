const util = require('util');
const _ = require('lodash');

function getGenerator(options) {
    var lines = options.html.split('\n');

    function generator(err) {
        var location = err.location;

        var args = _.toArray(arguments);
        args[0] = err.message;
        var message = util.format.apply(util, args);

        generator.errors.push({
            code: err.code,
            message: message,
            line: location ? location.line : 0,
            col: location ? location.col : 0,
            offset: location ? location.startOffset : 0,
            input: location ? lines[location.line - 1] : ''
        });
    }
    generator.errors = [];
    return generator;
}

exports.generator = getGenerator;
