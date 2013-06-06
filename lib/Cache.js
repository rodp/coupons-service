var redis  = require('redis'),
    config = require('../config'),
    client = redis.createClient(config.redis.port, config.redis.host, config.redis.other);

/**
 * Cache wrapper
 */
function Cache () {}

/**
 * Reads the coupon value from cache
 *
 * @param {String} campaignID
 * @param {Function} callback
 */
Cache.prototype.get = function (campaignID, callback) {
    client.get(campaignID, function (error, value) {
        if (error) {
            return callback(error);
        }

        callback(null, value);
    });
};

/**
 * Writes the coupon value to cache
 *
 * @param {String} campaignID
 * @param {Number} value
 * @param {Function} callback
 */
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
