'use strict';

const axios = require('axios');
const axiosExtensions = require('axios-extensions');
const url = require('url');

module.exports =  class TuneIn {
  constructor(options) {
    this.init(options);
  }

  init(options) {
    options = options || {};
    let protocol = options.protocol || 'https';
    let cacheRequests = options.cacheRequests || false;
    let cacheTTL = options.cacheTTL || 1000 * 60 * 10;
    let partnerId = options.partnerId || '';

    this.url = {};

    axios.defaults.baseURL = protocol + '://opml.radiotime.com';
    axios.defaults.params = {
      render: 'json'
    }

    if (cacheRequests === true) {
      axios.defaults.adapter = axiosExtensions.cacheAdapterEnhancer(
        axios.defaults.adapter,
        true,
        'cache',
        cacheTTL
      );
    }

    if (partnerId != '') {
      axios.defaults.params.push({
        partnerId: partnerId
      });
    }
  }

  search(query) {
    let req = {};
    req.params = {};

    req.url = '/Search.ashx';
    req.params.query = query;

    return this.call_tunein(req);
  }

  call_tunein(req) {
    return new Promise( (resolve, reject) => {
      axios.get(req.url, req)
        .then(function(results) {
          let head = results.data.head;
          if (head.status != 200) {
            reject(results.data);
            return new Error(`TuneIn Request error: ${head.fault}`);
          }

          for (var i in results.data.body) {
            if (results.data.body[i].URL) {
              results.data.body[i].URLObj = url.parse(results.data.body[i].URL, true);
            }
          }
          return resolve((results.data));
        })
        .catch(function(err) {
            return new Error(`TuneIn Request error: ${err}`);
        });
    });
  }

  tune_radio(id) {
    let req = {};
    req.params = {};

    req.url = '/Tune.ashx';
    req.params.id = id;

    return this.call_tunein(req);
  }

  browse(options) {
    options = options || {};
    let c = options.c || '';
    let id = options.id || '';
    let filter = options.filter || '';
    let offset = options.offset || '';
    let pivot = options.pivot || '';
    let username = options.username || '';

    let req = {};
    req.params = {};
    req.url = '/Browse.ashx';

    if (c) {
      req.params.c = c;
    }
    if (id) {
      req.params.id = id;
    }
    if (filter) {
      req.params.filter = filter;
    }
    if (offset) {
      req.params.offset = offset;
    }
    if (pivot) {
      req.params.pivot = pivot;
    }
    if (username) {
      req.params.username = username;
    }

    return this.call_tunein(req);
  }

  browse_local(username) {
    return this.browse({c: 'local', username: username});
  }

  browse_music(username) {
    return this.browse({c: 'music'});
  }

  browse_talk(username) {
    return this.browse({c: 'talk'});
  }

  browse_sports(username) {
    return this.browse({c: 'sports'});
  }

  browse_locations(username) {
    return this.browse({id : 'r0'});
  }

  browse_langs(username) {
    return this.browse({c: 'lang'});
  }

  browse_podcast(username) {
    return this.browse({c: 'podcast'});
  }

  browse_popular(username) {
    return this.browse({c: 'popular'});
  }

  browse_best(username) {
    return this.browse({c: 'best'});
  }
}
