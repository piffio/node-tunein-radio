'use strict';

var expect = require('chai').expect;
var TuneIn = require('../src/index');

var tuneinOptions = {
  protocol: 'https',
  cacheRequests: true,
  cacheTTL: 1000 * 60 * 60,
  partnerId: process.env.TUNEIN_PARTNERID,
};

var tunein = new TuneIn(tuneinOptions);

describe('#tuneinRadio', function() {
  // Test call to authenticate()
  it('should return 200 if login is successful', function() {
    var authOptions = {
      username: process.env.TUNEIN_USER,
      password: process.env.TUNEIN_PASSWD,
    };

    let browse = tunein.authenticate(authOptions);
    return browse.then(function(results) {
      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.have.lengthOf(3);

      expect(items[0].AccountId).to.equal(process.env.TUNEIN_ACCOUNTID);
    });
  });

  // Test calls to browse()
  it('should return main categories when browsing with no parameters', function() {
    let browse = tunein.browse();
    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Browse');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.have.lengthOf(7);

      let local = results.body[0];

      let expectedURL = "http://opml.radiotime.com/Browse.ashx?c=local";
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "&partnerId=" + tuneinOptions.partnerId;
      }

      expect(local.element).to.equal("outline");
      expect(local.type).to.equal("link");
      expect(local.text).to.equal("Local Radio");
      expect(local.URL).to.equal(expectedURL);
      expect(local.URLObj.href).to.equal(expectedURL);
      expect(local.URLObj.query.c).to.equal("local");
      expect(local.key).to.equal("local");
    });
  });

  // Test calls to browse_local()
  it('browse_local should return a list of radio stations', function() {
    let browse = tunein.browse_local();

    return browse.then(function(results) {
      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.be.an('array');

      let stationList = items[0];
      expect(stationList.element).to.equal("outline");
      expect(stationList.text).to.not.be.undefined;
      expect(stationList.children).to.be.an('array');

      let station = stationList.children[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("station");
    });
  });

  // Test calls to browse_music()
  it('browse_music should return a list of music genres', function() {
    let browse = tunein.browse_music();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Music');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let genre = items[0];
      expect(genre.element).to.equal("outline");
      expect(genre.type).to.equal("link");
      let guide_id = genre.guide_id;

      let expectedURL = "http://opml.radiotime.com/Browse.ashx?id=" + guide_id;
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "&partnerId=" + tuneinOptions.partnerId;
      }

      expect(genre.URL).to.equal(expectedURL);
    });
  });


  // Test calls to browse_talk
  it('browse_talk should return a list of talk music categories', function() {
    let browse = tunein.browse_talk();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Talk');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let genre = items[0];
      expect(genre.element).to.equal("outline");
      expect(genre.type).to.equal("link");
      let guide_id = genre.guide_id;

      let expectedURL = "http://opml.radiotime.com/Browse.ashx?id=" + guide_id;
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "&partnerId=" + tuneinOptions.partnerId;
      }

      expect(genre.URL).to.equal(expectedURL);
    });
  });

  // Test calls to browse_sports
  it('browse_sports should return a list of sport radio categories', function() {
    let browse = tunein.browse_sports();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Sports');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let genre = items[0];
      expect(genre.element).to.equal("outline");
      expect(genre.type).to.equal("link");
      let guide_id = genre.guide_id;

      let expectedURL = "http://opml.radiotime.com/Browse.ashx?id=" + guide_id;
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "&partnerId=" + tuneinOptions.partnerId;
      }

      expect(genre.URL).to.equal(expectedURL);
    });
  });

  // Test calls to browse_locations
  it('browse_locations should return a list of geographical areas', function() {
    let browse = tunein.browse_locations();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('By Location');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let area = items[0];
      expect(area.element).to.equal("outline");
      expect(area.type).to.equal("link");
      expect(area.text).to.equal("Africa");
      let guide_id = area.guide_id;

      let expectedURL = "http://opml.radiotime.com/Browse.ashx?id=" + guide_id;
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "&partnerId=" + tuneinOptions.partnerId;
      }

      expect(area.URL).to.equal(expectedURL);
    });
  });

  // Test calls to browse_langs
  it('browse_langs should return a list of languages', function() {
    let browse = tunein.browse_langs();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('By Language');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let area = items[0];
      expect(area.element).to.equal("outline");
      expect(area.type).to.equal("link");
      expect(area.text).to.equal("Aboriginal");
      let guide_id = area.guide_id;
    });
  });

  // Test calls to browse_podcast
  it('browse_podcast should return a list of podcasts', function() {
    let browse = tunein.browse_podcast();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Podcasts');

      let items = results.body;
      expect(items).to.be.an('array');

      let podcastTypes = items[0];
      expect(podcastTypes.element).to.equal("outline");
      expect(podcastTypes.text).to.equal("Music");
      expect(podcastTypes.children).to.be.an('array');

      let podcast = podcastTypes.children[0];
      expect(podcast.element).to.equal("outline");
      expect(podcast.type).to.equal("link");
      expect(podcast.guide_id).to.not.be.undefined;
    });
  });

  // Test calls to browse_popular
  it('browse_popular should return a list of popular radio stations', function() {
    let browse = tunein.browse_popular();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Trending');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.be.an('array');

      let station = items[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("station");
    });
  });

  // Test calls to browse_best
  it('browse_best should return a list of the best radio stations', function() {
    let browse = tunein.browse_best();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.be.undefined;

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.be.an('array');

      let station = items[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("station");
    });
  });

  // Test call to tune_radio
  it('tune_radio should return details about a radio stream', function() {
    let browse = tunein.tune_radio('s67868');

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.be.undefined;

      let status = results.head.status;
      expect(status).to.equal('200');

      let station = results.body[0];
      expect(station.element).to.equal("audio");

      let expectedURL = "http://provisioning.streamtheworld.com/pls/MAXIMAFM.pls?";
      if (tuneinOptions.partnerId != undefined) {
        expectedURL = expectedURL + "ua=" + tuneinOptions.partnerId
        + "&ttag=" + tuneinOptions.partnerId + '&';
      }
      expectedURL = expectedURL + "DIST=TuneIn&TGT=TuneIn&maxServers=2";
      expect(station.url).to.equal(expectedURL);
      expect(station.media_type).to.equal("mp3");
      expect(station.guide_id).to.equal("e2060591");
    });
  });

  // Test call to search
  it('search should return a list of matches for a particular query', function() {
    let browse = tunein.search('rai radio');

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Search Results: rai radio');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.be.an('array');

      let station = items[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("station");
    });
  });

  // Test call to browse_show
  it('browse_show should return a list of episodes for a Show', function() {
    let options = {
      c: 'pbrowse',
      id: 'p191418',
    };

    let browse = tunein.browse_show(options);

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Nocturnal Listening Options');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body[0].children;
      expect(items).to.be.an('array');

      let station = items[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("topic");
    });
  });

});
