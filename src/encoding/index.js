const jschardet = require('./fake-jschardet.js')
const ERR = require('../error/dfn.json')
const allowedEncoding = ['UTF-8', 'ascii']
const logger = require('../logger.js')('mip-validator:encoding')

function checkUTF8 (content, error) {
  var result = jschardet.detect(content)
  logger.debug('encoding detected:', result.encoding)
  if (
        allowedEncoding.indexOf(result.encoding) === -1 &&
        result.confidence >= 0.9
    ) {
    error(ERR.DISALLOWED_ENCODING, result.encoding)
  }
}

exports.checkUTF8 = checkUTF8
