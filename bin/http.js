#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Validator = require('..');
const path = require('path');
const http = require('http');

program
    .version(pkg.version)
    .option('-H, --host [host]', 'host to bind [127.0.0.1]', '127.0.0.1')
    .option('-p, --port [port]', 'port to bind [4444]', '4444')
    .option('-c, --conf [path]', 'validator configuration file [rules.json]');

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ node bin/http.js -H 0.0.0.0 -p 8888');
    console.log('');
});

program.parse(process.argv);

var config = null;
if (program['conf']) {
    var configPath = path.resolve(process.cwd(), program['conf']);
    config = require(configPath);
}
var validator = config ? Validator(config) : Validator();

const server = http.createServer((req, res) => {
    var html = '';
    req.on('data', (chunk) => {
        html += chunk;
    });
    req.on('end', () => {
        var result = validator.validate(html);
        console.log(html, result);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
});

server.listen(program['port'], program['host'], function() {
    console.log(`listening to ${program['host']}:${program['port']}`);
});
