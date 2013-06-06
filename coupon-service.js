var express = require('express'),
    cors    = require('cors'),
    Coupon  = require('./lib/Coupon');

var app = express();

app.use(cors());

app.get('/coupons/:campaignID', function (request, response) {
    var coupon = new Coupon({ campaignID: request.params.campaignID, ip: request.ip });
    
    coupon.fetch(function (error, coupon) {
        if (error) {
            response.send(500, error);
        } else if (coupon.value === null) {
            response.send(404);
        } else {
            response.send(coupon);
        }
    });
});

app.listen(3000);