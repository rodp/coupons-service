Coupons Web Service
===================

A simple restful service that generates coupons.

## Prerequisites

  - Node.js
  - NPM

## Usage

  1. Install dependencies:

        npm install

  2. Edit `config.js`

  3. Start the web service on port 3000:

        node coupon-service

  4. Do a GET request to `/coupons/{campaign_id}`. For example:

        GET /coupons/1

    would return something like:

        {
            campaignID: "1",
            ip: "192.168.56.1",
            id: "629d7870-ce32-11e2-a9db-07508202f10a",
            code: "5izwLzG9XUisjqKI",
            value: "123"
        }

## Development

Running tests:
    
    npm test

## Architecture and Flow

                 _____________    2    __________
                |             |<------|          |
             1  |             |   4*  |  Cache   |
      []  ----->|   Coupons   |------>|          |
     /||\ <-----| Web Service |        ----------
      /\     6  |             |   3*   __________
      ||        |             |<------|          |
                 -------------        | Database |
                       |              |          |
                     5 |               ----------
                       |
                       V
                 _____________ 
                |             |
                |             |
                |    Queue    |
                |             |
                |             |
                 -------------

  1. Receive GET request at `/coupons/:campaignID` (Express)
  2. Query cache (Redis) with campaign ID for coupon value
  3. If not found, query database (MySQL) for coupon value
  4. Cache the campaign ID, coupon value pair
  5. Submit the coupon to the remote queue (HTTP)
  6. Immediately respond with coupon JSON

## Decisions

  1. CORS is enabled to allow access to the service from different domains (i.e., from ads).
  2. Redis is used to cache DB queries and the caching layer can be independently scaled. A simpler caching system could have been used (e.g., Memcached), but Redis keeps more options open for future development.
  3. Cache, Database and Queue are wrapped, so they can be easily abstracted and mocked.
  4. Queue, in this case, is another web service (due to familiarity and time constraints), but it wouldn't be a problem to use something like RabbitMQ instead.
  5. Adding coupon to the Queue doesn't block response, of course. If we wanted to handle errors that occur while adding coupons to the Queue, we should do that offline.
  6. Sinon was used for stubs, Mocha for running tests.
  7. Dox was added and can be used to generate documentation.
  8. ...

