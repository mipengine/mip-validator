#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Validator = require('..');
const path = require('path');

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')
    .parse(process.argv);

var html = new Buffer(0);
var config;
if(program['conf']){
    var configPath = path.resolve(process.cwd(), program['conf']);
    var config = require(configPath);
}
var validator = config ? Validator(config) : Validator();

process.stdin.on('data', function(buf) {
    html = Buffer.concat([html, buf]);
});

process.stdin.on('end', function() {
    var result = validator.validate(html);
    var str = JSON.stringify(result, null, 4);
    console.log(str);
});

