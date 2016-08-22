const _ = require('lodash');
const regexSyntax = /\/(.*)\/(\w*)/;

function matchValue(src, target) {
    var match;
    if (match = target.match(regexSyntax)) {
        var re = new RegExp(match[1], match[2]);
        return re.test(src);
    } else {
        return src == target;
    }
}

function match(src, target) {
    var ret = true;
    _.forOwn(target, (value, key) => {
        if (!matchValue(src[key], value)) {
            ret = false;
        }
    });
    return ret;
}

function matchAttrs(node, target) {
    var attrSet = _.chain(node.attrs)
        .map(attr => [attr.name, attr.value])
        .fromPairs()
        .value();
    return match(attrSet, target);
}

module.exports = {
    match, matchAttrs, matchValue
};
