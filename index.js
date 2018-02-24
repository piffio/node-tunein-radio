'use strict';

const axios = require('axios');

module.exports =  class TuneIn {
  constructor() {
    this.init();
  }

  init() {
    this.url = {};

    axios.defaults.baseURL = 'https://opml.radiotime.com';
    axios.defaults.params = {
      render: 'json'
    }

    this.req = {};
    this.req.params = {};
    // TODO set partnerId
  }

  is_genre_id(id) {
    if (id == null || id.length == 0 || id[0] != 'g') {
      return false;
    }
    return true;
  }

  is_region_id(id) {
    if (id == null || id.length == 0 || id[0] != 'r') {
      return false;
    }
    return true;
  }

  search() {

  }

  call_tunein() {
    return new Promise( (resolve, reject) => {
      axios.get(this.req.url, this.req)
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

  browse(options) {
    options = options || {};
    let channel = options.channel || '';
    let id = options.id || '';
    let filter = options.filter || '';
    let offset = options.offset || '';
    let pivot = options.pivot || '';
    let username = options.username || '';

    this.req.url = '/Browse.ashx';

    if (channel) {
      this.req.params.c = channel;
    }
    if (id) {
      this.req.params.id = id;
    }
    if (filter) {
      this.req.params.filter = filter;
    }
    if (offset) {
      this.req.params.offset = offset;
    }
    if (pivot) {
      this.req.params.pivot = pivot;
    }
    if (username) {
      this.req.params.username = username;
    }

    return this.call_tunein();
  }

  browse_local(username) {
    return this.browse({channel: 'local', username: username});
  }

  browse_music(username) {
    return this.browse({channel: 'music'});
  }

  browse_talk(username) {
    return this.browse({channel: 'talk'});
  }

  browse_sports(username) {
    return this.browse({channel: 'sports'});
  }

  browse_locations(username) {
    return this.browse({id : 'r0'});
  }

  browse_langs(username) {
    return this.browse({channel: 'lang'});
  }

  browse_podcast(username) {
    return this.browse({channel: 'podcast'});
  }

  browse_popular(username) {
    return this.browse({channel: 'popular'});
  }

  browse_best(username) {
    return this.browse({channel: 'best'});
  }
}