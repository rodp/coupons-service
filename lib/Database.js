var mysql  = require('mysql'),
    config = require('../config'),
    pool   = mysql.createPool(config.mysql);

/**
 * Database wrapper
 */
function Database () {}

Database.prototype.get = function (campaignID, callback) {
    pool.getConnection(function (error, connection) {
        if (error) {
            return callback(error);
        }

        var query  = 'SELECT value FROM campaigns WHERE campaign_id = ?',
            params = [campaignID];

        connection.query(query, params, function (error, rows) {
            if (error) {
                return callback(error);
            }

            callback(null, rows.length ? rows[0].value : null);

            connection.end();
        });
    });
};

module.exports = Database;
