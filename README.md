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

## How it works

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

  1. Receive GET request at `/coupons/:campaignID`
  2. Query cache (Redis) with campaign ID for coupon value
  3. If not found, query database (MySQL) for coupon value
  4. Cache the campaign ID, coupon value pair
  5. Submit the coupon to the remote queue (RabbitMQ)
  6. Respond with coupon JSON

