# TuneIn Radio API client

```node-tunein-radio``` is a simple TuneIn Radio API javascript client, designed to be used in NodeJS.

[![Build Status](https://travis-ci.org/piffio/node-tunein-radio.svg?branch=master)](https://travis-ci.org/piffio/node-tunein-radio)
[![Coverage Status](https://coveralls.io/repos/github/piffio/node-tunein-radio/badge.svg?branch=master)](https://coveralls.io/github/piffio/node-tunein-radio?branch=master)
[![Dependencies](https://david-dm.org/piffio/node-tunein-radio.svg)](https://david-dm.org/piffio/node-tunein-radio)

# Install
```bash
$ npm install node-tunein-radio
```

# Use
```javascript
var TuneIn = require('node-tunein-radio');

var tunein = new TuneIn({ ... });

tunein.browse().then(function(result) {
    console.log(result);
}).catch(function(err) {
    console.log(err);
});
```

# Constructor options

When you instantiate a new TuneIn object, you can pass in an options object with the following fields:

```javascript
var tunein = new TuneIn({
    protocol        : 'https',          // Protocol to use, either 'http' or 'https', default https
    cacheRequests   : false,            // Wheter or not to cache requests, default false
    cacheTTL        : 1000 * 60 * 5,    // TTL for cached results, default 5 mins
    partnerId       : 'no default'      // a partnerId string provided by TuneIn, default to undefined
});
```

# License

MIT

# Contributing

Issues reports and PR are welcome.
