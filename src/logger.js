const _ = require('lodash');

function Logger(id) {
    if (!_.isString(id)) {
        throw new Error(`invalid logger id: ${id}`);
    }
    //var enabled = (process.env.DEBUG || '');
    return {
        log: createWith(console.log.bind(console), id),
        warn: createWith(console.warn.bind(console), id),
        error: createWith(console.error.bind(console), id),
        info: createWith(console.info.bind(console), id)
    };
}

function createWith(output, id) {
    return function() {
        var str = `[${timestamp()}][${id}] `;
        str += format.apply(exports, arguments);
        output(str);
        return str;
    };
}

function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

function timestamp() {
    var d = new Date();
    var date = [pad(d.getFullYear()),
        pad(d.getMonth() + 1),
        pad(d.getDate())
    ].join('/');
    var time = [pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())
    ].join(':');
    return date + '-' + time;
}

var formatRegExp = /%[sdj%]/g;

function format(f) {
    // no a format string
    if (!_.isString(f)) {
        return _.toArray(arguments).map(_.toString).join(' ');
    }

    i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
            case '%s':
                return String(args[i++]);
            case '%d':
                return Number(args[i++]);
            case '%j':
                try {
                    return JSON.stringify(args[i++]);
                } catch (_) {
                    return '[Circular]';
                }
                break;
            default:
                return x;
        }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
            str += ' ' + x;
        } else {
            str += ' ' + inspect(x);
        }
    }
    return str;
}

module.exports = Logger;
