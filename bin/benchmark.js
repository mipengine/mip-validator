#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Validator = require('..');
const path = require('path');
const fs = require('fs');

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [validator.json]')
    .parse(process.argv);

/*
 * Parse arguments
 */
var config;
if(program['conf']){
    var configPath = path.resolve(process.cwd(), program['conf']);
    config = require(configPath);
}

/*
 * Initialize validator
 */
var validator = config ? Validator(config) : Validator();

/*
 * Find html files
 */
var htmlDir = path.resolve(__dirname, '../examples/htmls');
var htmlFiles = fs.readdirSync(htmlDir);
console.log(`found ${htmlFiles.length} html files in ${htmlDir}`);

/*
 * Read html files
 */
console.time('reading htmls');
var htmls = htmlFiles.map(file => path.resolve(htmlDir, file))
    .map(filepath => fs.readFileSync(filepath, 'utf8'));
console.timeEnd('reading htmls');

/*
 * Validate html files
 */
console.time('validating htmls');
var results = htmls.map(html => validator.validate(html));
console.timeEnd('validating htmls');

