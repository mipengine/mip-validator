const _ = require('lodash');
const regexSyntax = /^(!?)\/(.*)\/(\w*)$/;
const logger = require('./logger.js')('mip-validator:matcher');

/*
 * convert regex-like string to regex
 * @param {str} the regex-like string to convert
 */
function stringToRegex(str) {
    var match = str.match(regexSyntax);
    if (!match) {
        return null;
    }
    var regex = new RegExp(match[2], match[3])
    if (match[1] === '!') {
        regex.negate = true;
    }
    return regex;
}

/*
 * match string with string rule
 * @param {String} src the string to match
 * @param {String} target the string or regex-like string to match with
 */
function matchValue(src, target) {
    var re;
    if (re = stringToRegex(target)) {
        var result = re.test(src);
        return re.negate ? (!result) : result;
    } else {
        return src == target;
    }
}

/*
 * object match: match src with target
 * @param {Object} src the object to match
 * @param {Object} target the object to match with
 * legacy:
 *      match({
 *          id: 'modal-user'
 *      }, {
 *          id: '/^modal-.+$/'
 *      });
 */
function match(src, target) {
    var ret = true;
    _.forOwn(target, (value, key) => {
        if (!matchValue(src[key], value)) {
            ret = false;
        }
    });
    return ret;
}

/*
 * attributes match
 * @param {ASTNode} node the node of which attributes will be matched
 * @param {Object} target the attribute list object to match with
 * legacy:
 *      matchAttrs(node, {
 *          style: 'color:red',
 *          id: '/mip-.+/'
 *      });
 */
function matchAttrs(node, target) {
    var attrSet = _.chain(node.attrs)
        .map(attr => [attr.name, attr.value])
        .fromPairs()
        .value();
    return match(attrSet, target);
}

/*
 * match ancestor name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} ancestorNodeName string or regex-like string to match with
 * legacy:
 *      matchAncestor(node, 'form');
 *      matchAncestor(node, '/form|div|section/'
 */
function matchAncestor(node, ancestorNodeName) {
    // match_ancestor disabled
    if (!ancestorNodeName) return true;

    while (node = node.parentNode) {
        if (matchValue(node.nodeName, ancestorNodeName)) return true;
    }
    return false;
}

/*
 * match parent name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} parentNodeName string or regex-like string to match with
 * legacy:
 *      matchParent(node, 'form');
 *      matchParent(node, '/form|div|section/'
 */
function matchParent(node, parentNodeName) {
    logger.debug('matching parent:', parentNodeName);

    // match disabled 
    if (!parentNodeName) return true;
    // there's no parent
    if (!node.parentNode) return false;

    return matchValue(node.parentNode.nodeName, parentNodeName);
}

/*
 * match descendant node name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} descendantNodeName string or regex-like string to match with
 * legacy:
 *      matchDescendant(node, 'form');
 *      matchDescendant(node, '/form|div|section/'
 */
function matchDescendant(node, descendantNodeName) {
    // match disabled 
    if (!descendantNodeName) return true;
    // is there a match?
    return dfsUntil(node, child => matchValue(child.nodeName, descendantNodeName));
}

/*
 * nomatch descendant node name
 * @param {ASTNode} node the node of which parent will be matched
 * @param {String} descendantNodeName string or regex-like string to match with
 * legacy:
 *      nomatchDescendant(node, 'form');
 *      nomatchDescendant(node, '/form|div|section/'
 */
function nomatchDescendant(node, descendantNodeName) {
    logger.debug('nomatching descendant:', descendantNodeName);

    // match disabled, pass
    if (!descendantNodeName) return true;
    // is there a match?
    return !matchDescendant(node, descendantNodeName);
}

function dfsUntil(node, predict) {
    var children = node.childNodes || [];
    return predict(node) || children.some(child => dfsUntil(child, predict));
}

/*
 * Create a ASTNode for given nodeName and attribute object
 */
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

/*
 * Generate a fingerprint for given nodeName and attributes
 * legacy:
 *      // returns: <div id="modal">
 *      fingerprintByObject('div', {id: 'modal'});
 */
function fingerprintByObject(nodeName, attrsObj) {
    var tag = createNode(nodeName, attrsObj);
    return fingerprintByTag(tag);
}

/*
 * Generate a fingerprint for given node
 * @param {ASTNode} node
 */
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

/*
 * Match tagnames from the given HTML
 * @param {Array} tagNames
 * @param {String} html
 * legacy: matchTagNames(['div', 'head', 'iframe'], '<div><iframe></div>')
 */
function matchTagNames(tagNames, html) {
    var tagsStr = tagNames.join('|');
    var re = new RegExp(`<\\s*(${tagsStr})(?:\\s+[^>]*)*>`, 'ig');
    return (html || '').match(re) || [];
}

module.exports = {
    match,
    matchAttrs,
    matchValue,
    regexSyntax,
    fingerprintByTag,
    createNode,
    fingerprintByObject,
    stringToRegex,
    matchTagNames,
    matchParent,
    matchAncestor,
    nomatchDescendant,
    matchDescendant
};
