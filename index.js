const _ = require('lodash');
const Engine = require('./src/engine.js');

module.exports = function(rules) {
    var engine = Engine(rules);

    // attr
    engine.register(require('./src/validators/disallowed_attr.js'));
    engine.register(require('./src/validators/mandatory_oneof_attr_missing.js'));
    engine.register(require('./src/validators/invalid_attr_value.js'));

    // tag
    engine.register(require('./src/validators/disallowed_tag.js'));
    engine.register(require('./src/validators/duplicate_unique_tag.js'));
    engine.register(require('./src/validators/mandatory_tag_missing.js'));

    return engine;
};

