const program = require('commander');
const pkg = require('../package.json');
const Validator = require('..');
const path = require('path');

program
    .version(pkg.version)
    .option('-f, --file [path]', 'validator configuration [validator.json]', 'validator.json')
    .parse(process.argv);

var html = '';
var configPath = path.resolve(process.cwd(), program.file);
var config = require(configPath);
var validator = Validator(config);

process.stdin.on('data', function(buf) {
    html += buf.toString();
});

process.stdin.on('end', function() {
    var result = validator.validate(html);
    var str = JSON.stringify(result, null, 4);
    console.log(str);
});
