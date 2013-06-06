var http   = require('http'),
    config = require('../config');

/**
 * Queue API wrapper
 */
function Queue () {}

/**
 * Adds a coupon to the queue
 *
 * @param {Coupon} coupon
 * @param {Function} callback
 */
Queue.prototype.add = function (coupon, callback) {
    var options = config.queue,
        data    = JSON.stringify(coupon);

    options.headers = {
        'Content-Type'   : 'application/json',
        'Content-Length' : data.length 
    }

    var post = http.request(options, function (response) {  
        response.setEncoding('utf8');
        response.on('data', callback);
        response.on('error', callback);
    });  
      
    post.write(data);
    post.end();
};

module.exports = Queue;
