const _ = require('lodash');

function normalize(config) {
    config = config || {};
    _.forOwn(config, (v, k) => {
        config[k] = normalizeTagConfig(v);
    });
    return config;
}

function normalizeTagConfig(config) {
    if (!config) return config;

    _.forOwn(config, (v, k) => {
        if (k === 'mandatory') {
            if (v === false) {
                return;
            }
            if (v === true) {
                v = {};
            }
            if (!_.isArray(v)) {
                v = [v];
            }
            config[k] = v;
        }
    });
    return config;
}

exports.normalize = normalize;
