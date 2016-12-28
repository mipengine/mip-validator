const jschardet = require("jschardet")
const ERR = require('./error.json');
const allowedEncoding = ['UTF-8', 'ascii'];

function checkUTF8(content, error) {
    var result = jschardet.detect(content);
    if (
        allowedEncoding.indexOf(result.encoding) === -1 &&
        result.confidence >= 0.9
    ) {
        error(ERR.DISALLOWED_ENCODING, result.encoding);
    }
}

exports.checkUTF8 = checkUTF8;
