var redis  = require('redis'),
    config = require('../config'),
    client = redis.createClient(null, null, config.redis);

/**
 * Cache wrapper
 */
function Cache () {}

Cache.prototype.get = function (campaignID, callback) {
    client.get(campaignID, function (error, value) {
        if (error) {
            return callback(error);
        }

        callback(null, value);
    });
};

Cache.prototype.set = function (campaignID, value, callback) {
    client.set(campaignID, value, function (error) {
        if (error) {
            return callback(error);
        }

        if (callback instanceof Function) {
            callback();
        }
    });
};

module.exports = Cache;
