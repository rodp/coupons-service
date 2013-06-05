var sinon  = require('sinon'),
    assert = require('assert'),

    Cache    = require('../lib/Cache'),
    Database = require('../lib/Database'),
    Queue    = require('../lib/Queue'),
    Coupon   = require('../lib/Coupon');

// Stubs, etc.
var dbGet, cacheGet, cacheSet, queueAdd, coupon1, coupon2;

before(function () {
    dbGet = sinon.stub(Database.prototype, 'get');
    dbGet.withArgs(1).yields(null, 123);
    dbGet.withArgs(2).yields(null, 234);

    cacheGet = sinon.stub(Cache.prototype, 'get');
    cacheGet.withArgs(1).yields(null, null);
    cacheGet.withArgs(2).yields(null, 234);

    cacheSet = sinon.stub(Cache.prototype, 'set');
    
    queueAdd = sinon.stub(Queue.prototype, 'add', function (coupon, callback) { callback(); });
});

after(function () {
    dbGet.restore();
    cacheGet.restore();
    cacheSet.restore();
    queueAdd.restore();
});

beforeEach(function () {
    coupon1 = new Coupon({ campaignID: 1, ip: '127.0.0.1' });
    coupon2 = new Coupon({ campaignID: 2, ip: '127.0.0.1' });
});

afterEach(function () {
    dbGet.reset();
    cacheGet.reset();
    cacheSet.reset();
    queueAdd.reset();
});

describe('Coupon', function () {

    describe('#constructor', function () {
        it('should set initial values', function () {
            assert.equal(coupon1.campaignID, 1);
            assert.equal(coupon1.ip, '127.0.0.1');
        });

        it('should generate correct UUID and promotional code', function () {
            assert(coupon1.id);
            assert(coupon1.code);

            assert.equal(coupon1.id.length, 36);
            assert.equal(coupon1.code.length, 16);
        });
    });
    
    describe('#fetch()', function () {
    
        it('should get the value from DB and then cache it', function (done) {
            coupon1.fetch(function (error, coupon) {
                assert.equal(coupon.value, 123);
                assert(cacheGet.called);
                assert(dbGet.called);
                assert(cacheSet.called);
                done();
            });
        });

        it('should get the value from Cache', function (done) {
            coupon2.fetch(function (error, coupon) {
                assert.equal(coupon.value, 234);
                assert(cacheGet.called);
                assert(!dbGet.called);
                done();
            });
        });
    });

    describe('#submit()', function () {

        it('should submit the coupon to Queue', function (done) {
            coupon1.submit(function (error) {
                assert(queueAdd.called);
                done();
            });
        });

    });

});