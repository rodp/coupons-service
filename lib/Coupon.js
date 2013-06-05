var uuid   = require('node-uuid'),

    Cache    = require('./Cache'),
    Database = require('./Database'),
    Queue    = require('./Queue');

/**
 * Encapsulates coupon fetching/creation and submitting.
 *
 * Example:
 *
 *     var c = new Coupon({ campaignID: 1, ip: '127.0.0.1' });
 * 
 * @param {object} data object containing initial values (campaignID, ip)
 */
function Coupon (data) {
    this.campaignID = data.campaignID;
    this.ip         = data.ip;
    this.id         = uuid.v1();
    this.code       = Coupon.generateCode();
    this.value      = null;
}

/**
 * Generates a string of 16 random alphanumeric characters.
 */
Coupon.generateCode = function () {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

/**
 * Fetches coupon value from either DB or cache and updates the coupon properties.
 *
 * @param {Function} callback function
 */
Coupon.prototype.fetch = function (callback) {
    var coupon = this;

    // Look in cache first
    var cache = new Cache();
    cache.get(coupon.campaignID, function (error, value) {
        if (error) {
            return callback(error);
        }

        // Found in cache
        if (value !== null) {
            coupon.value = value;
            callback(null, coupon);
        }

        // Not found in cache
        else {

            // Look in DB
            var db = new Database();
            db.get(coupon.campaignID, function (error, value) {
                if (error) {
                    return callback(error);
                }

                // Found in DB
                if (value !== null) {
                    coupon.value = value;
                    cache.set(coupon.campaignID, value);
                    coupon.submit();
                }

                callback(null, coupon);
            });
        }
    });
};

/**
 * Submits the coupon to the remote queue.

 * @param {Function} callback function
 */
Coupon.prototype.submit = function (callback) {
    var coupon = this,
        queue  = new Queue();

    queue.add(coupon, function (error) {
        if (error) {
            console.error('There was an error submitting coupon ' + coupon);
            return callback(error);
        }

        if (callback instanceof Function) {
            callback();
        }
    });
};

/**
 * Returns coupon's string representation. 
 *
 * @return {String}
 */
Coupon.prototype.toString = function () {
    return '#' + this.id;
};

module.exports = Coupon;
