const _ = require('lodash');
const Engine = require('./src/engine.js');
const config = require('./src/config.js');

module.exports = function(rules) {
    var engine = Engine(config.normalize(rules));

    // attr
    engine.register(require('./src/validators/disallowed_attr.js'));
    engine.register(require('./src/validators/mandatory_oneof_attr_missing.js'));
    engine.register(require('./src/validators/invalid_attr_value.js'));
    engine.register(require('./src/validators/invalid_property_value_in_attr_value.js'));

    // tag
    engine.register(require('./src/validators/disallowed_tag.js'));
    engine.register(require('./src/validators/duplicate_unique_tag.js'));
    engine.register(require('./src/validators/mandatory_tag_missing.js'));

    // nesting
    engine.register(require('./src/validators/disallowed_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_parent.js'));

    return engine;
};

