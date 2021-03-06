'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(definition, links, resource, options, cb) {
    let args = [];
    if (arguments.length === 5) {
        args.push(resource, options);
    } else {
        cb = options;
        options = resource;
        args.push(options);
    }

    async.each(_.toPairs(definition), function(pair, fn) {
        let link = pair[1];
        let callback = function(err, calculated) {
            if (err) {
                return fn(err);
            }
            if (typeof calculated !== 'undefined') {
                _.set(links, pair[0], calculated);
            }
            fn();
        };

        if (_.isFunction(link)) {
            let tempArgs = args.slice();
            if (link.length > tempArgs.length) {
                tempArgs.push(callback);
                return link.apply(null, tempArgs);
            } else {
                link = link.apply(null, tempArgs);
                if (typeof link !== 'undefined') {
                    _.set(links, pair[0], link);
                }
                async.setImmediate(fn);
            }
        } else {
            if (typeof link !== 'undefined') {
                _.set(links, pair[0], link);
            }
            async.setImmediate(fn);
        }
    }, cb);
};
