const _ = require('lodash');
const Engine = require('./src/engine.js');
const config = require('./src/config.js');
const rules = require('./rules.json');
const preprocess = require('./src/preprocess.js');
const logger = require('./src/logger.js')('mip-validator:index');

function factory(rules, conf) {
    // NPM compliance
    if(rules === 'package.json'){
        return require('./package.json');
    }

    conf = conf || {};
    conf.rules = rules;
    conf = config.normalize(conf);
    conf = preprocess.process(conf);
    var engine = Engine(conf);

    // attr
    engine.register(require('./src/validators/disallowed_attr.js'));
    engine.register(require('./src/validators/mandatory_oneof_attr_missing.js'));
    engine.register(require('./src/validators/invalid_attr_value.js'));
    engine.register(require('./src/validators/invalid_property_value_in_attr_value.js'));

    // tag
    engine.register(require('./src/validators/disallowed_tag.js'));
    engine.register(require('./src/validators/duplicate_unique_tag.js'));
    engine.register(require('./src/validators/mandatory_tag_missing.js'));
    engine.register(require('./src/validators/invalid_inner_html.js'));

    // nesting
    engine.register(require('./src/validators/disallowed_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_ancestor.js'));
    engine.register(require('./src/validators/mandatory_tag_parent.js'));

    return engine;
}

factory.rules = _.cloneDeep(rules);

module.exports = factory;

