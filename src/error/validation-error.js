const util = require('util')
const _ = require('lodash')

function ValidationError(message, code, location, lines) {
    this.message = message
    this.code = code
    this.line = location ? location.line : 0
    this.col = location ? location.col : 0
    this.offset = location ? location.startOffset : 0
    this.input = location ? lines[location.line - 1] : ''
}
ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.name = 'ValidationError'

function getGenerator(options) {
    var lines = options.html.split('\n')

    function generator(err) {
        var location = err.location

        var args = _.toArray(arguments)
        args[0] = err.message
        var message = util.format.apply(util, args)

        err = new ValidationError(message, err.code, location, lines)

        if (options.fast) {
            throw err
        }
        generator.errors.push(err)
    }
    generator.errors = []
    return generator
}

exports.generator = getGenerator
exports.ValidationError = ValidationError