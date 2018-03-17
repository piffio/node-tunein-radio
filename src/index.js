'use strict';

const axios = require('axios');
const axiosExtensions = require('axios-extensions');
const url = require('url');
const qs = require('qs');

/**
 * TuneIn class, the main class implementing the module
 *
 * @example
 * let tuneinOptions = {
 *  protocol: 'https',                        // Protocol to use, either http or https
 *  cacheRequests: true,                      // Wheter to cache results or not, default false
 *  cacheTTL: 1000 * 60 * 60,                 // Cache TTL, default 5 minutes
 *  partnerId: process.env.TUNEIN_PARTNERID,  // PartnerID to be used when interacting with the TuneIn API
 *  };
 *
 * let tunein = new TuneIn(tuneinOptions);
 */
module.exports =  class TuneIn {
  /**
   * Constructur for a TuneIn object.
   * @param {object} options this is an options object with all the optionals parameters used to initialise the TuneIn client
   * @example
   * let tuneinOptions = {
   *   protocol: 'https',                        // Protocol to use, either http or https
   *   cacheRequests: true,                      // Wheter to cache results or not, default false
   *   cacheTTL: 1000 * 60 * 60,                 // Cache TTL, default 5 minutes
   *   partnerId: process.env.TUNEIN_PARTNERID,  // PartnerID to be used when interacting with the TuneIn API
   * };
   */
  constructor(options) {
    options = options || {};
    let protocol = options.protocol || 'https';
    let cacheRequests = options.cacheRequests || false;
    let cacheTTL = options.cacheTTL || 1000 * 60 * 10;
    let partnerId = options.partnerId || '';

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = protocol + '://opml.radiotime.com';
    axios.defaults.params = {
      render: 'json'
    };

    if (cacheRequests === true) {
      axios.defaults.adapter = axiosExtensions.cacheAdapterEnhancer(
        axios.defaults.adapter,
        true,
        'cache',
        cacheTTL
      );
    }

    if (partnerId != '') {
      axios.defaults.params.partnerId = partnerId;
    }
  }

  /**
   * Search TuneIn for a match
   * @param {string} query a query string to search for in the TuneIn catalog
   * @example
   * let queryString = 'rai radio';
   * let search = tunein.search(queryString);
   * search.then(function(results) {
   *   console.log(results);
   * });
   */
  search(query) {
    let req = {};
    req.params = {};

    req.url = '/Search.ashx';
    req.params.query = query;

    return this._call_tunein_get(req);
  }

  /**
   * @private
   */
  _call_tunein_get(req) {
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

  /**
   * @private
   */
  _call_tunein_post(req, postData) {
    return new Promise( (resolve, reject) => {
      axios.post(req.url, qs.stringify(postData), req)
        .then(function(results) {
          let head = results.data.head;
          if (head.status != 200) {
            reject(results.data);
            return new Error(`TuneIn Request error: ${head.fault}`);
          }
          return resolve((results.data));
        })
        .catch(function(err) {
            return new Error(`TuneIn Request error: ${err}`);
        });
    });
  }

  /**
   * Tune a stream. This will return an object containing details for the specific stream, including URL and format.
   * @param {string} id The ID of the stream to tune, usually resulting from a browsing or a search call
   */
  tune_radio(id) {
    let req = {};
    req.params = {};

    req.url = '/Tune.ashx';
    req.params.id = id;

    return this._call_tunein_get(req);
  }

  /**
   * Describe a stream. This method will retrieve detailed information about a stream.
   *
   * @param {string} id The ID of the stream to fetch information for
   * @param {boolean} nowplaying If true it also fetches information about the show being currently aired
   */
  describe(id, nowplaying = false) {
    let req = {};
    req.params = {};

    req.url = '/Describe.ashx';
    if (nowplaying == true) {
      req.params.c = 'nowplaying';
    }
    req.params.id = id;

    return this._call_tunein_get(req);
  }

  /**
   * Authenticate with supplied username / password, to get access to favorite and customised results
   * @param {object} options Options to be passed to the POST call, must contain user's credential
   * @example
   * let authOptions = {
   *   username: 'user@example.com',
   *   password: 'secretpassword'
   * };
   * let auth = tunein.authenticate(authOptions);
   * auth.then(function(results) {
   *   console.log(results[0].AccountId);
   * });
   */
  authenticate(options) {
    options = options || {};

    let req = {};
    req.url = '/Account.ashx';
    req.params = {};
    req.params.c = 'auth';

    return this._call_tunein_post(req, options);
  }

  /**
   * @private
   */
  _call_browse(options, req) {
    options = options || {};
    let c = options.c || '';
    let id = options.id || '';
    let filter = options.filter || '';
    let offset = options.offset || '';
    let pivot = options.pivot || '';
    let username = options.username || '';

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

    return this._call_tunein_get(req);
  }

  /**
   * Browse a podcast (Show) for episodes details
   * @param {object} options - Options object including the show ID
   * @example
   * let showOptions = {
   *   c: 'pbrowse',
   *   id: 'p191418'
   * };
   * let show = tunein.browse_show(showOptions);
   * show.then(function(results) {
   *   console.log(results);
   * });
   */
  browse_show(options) {
    let req = {};
    req.params = {};
    req.url = '/Tune.ashx';

    return this._call_browse(options, req);
  }

  /**
   * Browse will browse the TuneIn directory depending on the supplied options paramethers
   *
   * @param {object} options - Options object for browsing
   * @return {object} results - A JSON object with results from the remote API
   */
  browse(options) {
    let req = {};
    req.params = {};
    req.url = '/Browse.ashx';

    return this._call_browse(options, req);
  }

  /**
   * Browse the local streams category
   * @param {string} username - Currently ignored
   */
  browse_local(username) {
    return this.browse({c: 'local', username: username});
  }

  /**
   * Browse the Music streams category
   * @param {string} username - Currently ignored
   */
  browse_music(username) {
    return this.browse({c: 'music'});
  }

  /**
   * Browse the talk streams category
   * @param {string} username - Currently ignored
   */
  browse_talk(username) {
    return this.browse({c: 'talk'});
  }

  /**
   * Browse the sports streams category
   * @param {string} username - Currently ignored
   */
  browse_sports(username) {
    return this.browse({c: 'sports'});
  }

  /**
   * Browse streams locations
   * @param {string} username - Currently ignored
   */
  browse_locations(username) {
    return this.browse({id : 'r0'});
  }

  /**
   * Browse streams languages
   * @param {string} username - Currently ignored
   */
  browse_langs(username) {
    return this.browse({c: 'lang'});
  }

  /**
   * Browse the podcasts directory
   * @param {string} username - Currently ignored
   */
  browse_podcast(username) {
    return this.browse({c: 'podcast'});
  }

  /**
   * Browse the popular streams category
   * @param {string} username - Currently ignored
   */
  browse_popular(username) {
    return this.browse({c: 'popular'});
  }

  /**
   * Browse the best streams category
   * @param {string} username - Currently ignored
   */
  browse_best(username) {
    return this.browse({c: 'best'});
  }
}
