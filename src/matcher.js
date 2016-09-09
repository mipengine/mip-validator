const _ = require('lodash');
const regexSyntax = /^\/(.*)\/(\w*)$/;

function stringToRegex(str){
    var match = str.match(regexSyntax);
    return match ? new RegExp(match[1], match[2]) : null;
}

function matchValue(src, target) {
    var re;
    if (re = stringToRegex(target)) {
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

function createNode(nodeName, attrsObj) {
    return {
        nodeName,
        attrs: _.chain(attrsObj)
            .toPairs()
            .map(pair => ({
                name: pair[0],
                value: pair[1]
            }))
            .value()
    };
}

function fingerprintByObject(nodeName, attrsObj){
    var tag = createNode(nodeName, attrsObj);
    return fingerprintByTag(tag);
}

function fingerprintByTag(node) {
    var attrStr = _.chain(node.attrs)
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(' ')
        .value();
    if (attrStr.length) {
        attrStr = ' ' + attrStr;
    }
    return `<${node.nodeName}${attrStr}>`;
}

module.exports = {
    match, matchAttrs, matchValue, fingerprintByTag, createNode, fingerprintByObject,
    stringToRegex
};
