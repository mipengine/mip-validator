const _ = require('lodash');
const ERR = require('../error.json');
const POLYFILL_TAGS = ['frame', 'frameset'];

exports.onBegin = function(engine) {
    validatePolyfill(engine);
};

exports.onNode = function(node, rule, engine) {
    if (!rule.disallow || _.includes(POLYFILL_TAGS, node.nodeName)) return;
        var err = ERR.DISALLOWED_TAG;
        engine.createError(err.code, err.message, node.__location);
};

function validatePolyfill(engine){
    POLYFILL_TAGS.forEach(tag => {
        if(!_.get(engine.rules, `${tag}.disallow`)) return;

        var re = new RegExp(`<\\s*${tag}(\\s+.*)*>`, 'g');
        var match = engine.html.match(re);
        if(match){
            var err = ERR.DISALLOWED_TAG;
            var msg = err.message;
            engine.createError(err.code, msg);
        }
    });
}
