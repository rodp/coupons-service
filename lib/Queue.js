var amqp       = require('amqp'),
    config     = require('../config');
    //connection = amqp.createConnection(config.amqp);

/**
 * Queue wrapper
 */
function Queue () {}

Queue.prototype.add = function (coupon, callback) {
    //connection.publish('coupons', coupon);
    callback();
};

module.exports = Queue;
