#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Validator = require('..');
const path = require('path');

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')
    .parse(process.argv);

var html = '';
var config;
if(program['conf']){
    var configPath = path.resolve(process.cwd(), program['conf']);
    var config = require(configPath);
}
var validator = config ? Validator(config) : Validator();

process.stdin.on('data', function(buf) {
    html += buf.toString();
});

process.stdin.on('end', function() {
    html = normalize(html);
    var result = validator.validate(html);
    var str = JSON.stringify(result, null, 4);
    console.log(str);
});

/*
 * @param {String} fileContent The unicode string from file
 * @return {String} The normalized string
 */
function normalize(fileContent){
    return fileContent.replace(/^\uFEFF/, '');
}
