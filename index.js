const parse5 = require('parse5');
const _ = require('lodash');
const ERR = require('./error-code.json');
const zh_cn = require('./i18n/zh_cn.json');


/*
 * 校验器
 * @param rules(Object) 规则集合
 * @return 校验器实例
 */
function Validator(rules) {
    this.rules = rules || {};
    return this;
}


/*
 * 错误生成器
 * @param code(String) 错误代码
 * @param location(ElementLocationInfo) 位置信息
 *   文档: https://github.com/inikulin/parse5/wiki/Documentation#ElementLocationInfo
 * @return Object 错误对象
 */
Validator.prototype.createError = function(code, rule, location) {
    var err = {
        code: code || "000",
        rule: rule,
        line: location ? location.line : 0,
        col: location ? location.col : 0,
        offset: location ? location.startOffset : 0,
        input: location ? this.lines[location.line - 1] : ''
    };
    err.message = zh_cn[err.code];
    this.errors.push(err);
};


/*
 * 深度优先遍历
 */
Validator.prototype.dfs = function(node) {
    var rule = this.rules[node.nodeName];
    if (rule) {
        this.validateNode(node, rule);

        var attrs = node.attrs || [];
        attrs.forEach(attr => {
            var attrRule = _.get(rule.attrs, attr.name);
            if (!attrRule) return;

            this.validateAttr(attr, node, attrRule);
        });
    }
    var children = node.childNodes || [];
    children.forEach(child => this.dfs(child));
};


/*
 * 校验DOM属性
 */
Validator.prototype.validateAttr = function(attr, node, rule) {
    if (rule.value) {
        var regex = new RegExp(rule.value);
        if (!regex.test(attr.value)) {
            this.createError(ERR.INVALID_ATTR_VALUE, attr.name, node.__location);
        }
    }
};


/*
 * 校验DOM Node
 */
Validator.prototype.validateNode = function(node, rule) {
    // count occurrence
    if (undefined === this.occurrence[node.nodeName]) {
        this.occurrence[node.nodeName] = 0;
    }
    this.occurrence[node.nodeName]++;

    // check attr occurrence
    var attrOccurrence = _.keyBy(node.attrs, 'name');
    this.checkOccurrence(rule.attrs, attrOccurrence, (k, v, err) => {
        var code = [ERR.MANDATORY_ONEOF_ATTR_MISSING, ERR.DISALLOWED_ATTR][err];
        this.createError(code, k, node.__location);
    });
};


/*
 * 检查出现次数
 */
Validator.prototype.checkOccurrence = function(rules, occurrence, cb) {
    _.forOwn(rules, (rule, ruleName) => {
        if (rule.mandatory && !occurrence[ruleName]) {
            cb(ruleName, rule, 0);
        }
        if (rule.disallow && occurrence[ruleName]) {
            cb(ruleName, rule, 1);
        }
    });
};


/*
 * 校验
 * @param html 被校验的HTML字符串
 * @return [error] 错误数组
 */
Validator.prototype.validate = function(html) {
    // reset
    this.errors = [];
    this.occurrence = {};
    this.html = html;
    this.lines = html.split('\n');

    var document = parse5.parse(html, {
        locationInfo: true
    });

    this.dfs(document);
    this.checkOccurrence(this.rules, this.occurrence, (k, v, err) => {
        var code = [ERR.MANDATORY_TAG_MISSING, ERR.DISALLOWED_TAG][err];
        this.createError(code, k);
    });
    return this.errors;
};


module.exports = function(rules) {
    return new Validator(rules);
};
