/*
 * Logger constructor
 * @param {String} id trace ID of the logger instance, typically use module ID
 */
function Logger(id) {
    if (!isString(id)) {
        throw new Error(`invalid logger id: ${id}`);
    }
    var debugEnabled = match(process.env.DEBUG, id);
    return {
        debug: debugEnabled ? createWith(console.log.bind(console), id) : x => false,
        log: createWith(console.log.bind(console), id),
        warn: createWith(console.warn.bind(console), id),
        error: createWith(console.error.bind(console), id),
        info: createWith(console.info.bind(console), id)
    };
}

function isString(obj) {
    return (typeof obj === 'string' || obj instanceof String);
}

/*
 * match id with DEBUG switch
 * @param {string} root DEBUG switch
 * @param {String} path trace ID
 */
function match(root, path) {
    if (!root) return false;
    root = String(root).split(':').filter(x => x.length);
    path = (path || '').split(':').filter(x => x.length);
    for (var i = 0; i < root.length; i++) {
        if (path[i] != root[i]) return false;
    }
    return true;
}

/*
 * create logger method with STDOUT instance and trace ID 
 * @param {Function} output STDOUT instance
 * @param {String} id trace ID
 * legacy:
 *      createWith(console.log.bind(console), 'mip:cache:getCache')
 */
function createWith(output, id) {
    return function() {
        var str = `[${timestamp()}][${id}] `;
        str += format.apply(exports, arguments);
        output(str);
        return str;
    };
}

/*
 * Pad number to 2-digit.
 * @param {Number} n The number
 * @return {String} 2-digit number string
 * legacy:
 *      pad(2)      // 02
 *      pad(22)     // 22
 */
function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

/*
 * Generate a timestamp from current time 
 * @return {String} the timestamp string
 * legacy:
 *      timestamp()    // "2016/09/27-17:31:22"
 */
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

var formatRegExp = /%[sdjJ%]/g;

/*
 * format arguments to a single string
 * @param {String} f Optional, the format string
 * @return {String} the formated string
 * legacy:
 *      format('%s', 'foo', 'bar')  // foo bar
 *      format('%d', '200', 'bar')  // 200 bar
 *      format('%j', {foo: 'bar'}, 'bar')
 *                                  // {"foo":"bar"}bar
 *      format('%j', {foo: 'bar'}, 'bar')
 *                                  // \n{\n    "foo": "bar"\n}\nbar
 *      format('foo', 'bar')        // foo bar
 */
function format(f) {
    var i = 0;
    var args = arguments;
    var len = args.length;
    var str = '';
    if (isString(f)) {
        i++;
        str += String(f).replace(formatRegExp, function(x) {
            if (i >= len) return x;
            switch (x) {
                case '%%':
                    return '%';
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
                case '%J':
                    try {
                        return '\n' + JSON.stringify(args[i++], null, 4) + '\n';
                    } catch (_) {
                        return '\n[Circular]\n';
                    }
                    break;
                default:
                    return x;
            }
        });
    }
    for (var x = args[i]; i < len; x = args[++i]) {
        str += ' ' + x;
    }
    return str;
}

module.exports = Logger;
