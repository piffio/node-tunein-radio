'use strict';

var expect = require('chai').expect;
var TuneIn = require('../index');

describe('#tuneinRadio', function() {
  // Test calls to browse()
  it('should return main categories when browsing with no parameters', function() {
    let tunein = new TuneIn();
    let browse = tunein.browse();

    return browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Browse');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.have.lengthOf(7);

      let local = results.body[0];
      expect(local.element).to.equal("outline");
      expect(local.type).to.equal("link");
      expect(local.text).to.equal("Local Radio");
      expect(local.URL).to.equal("http://opml.radiotime.com/Browse.ashx?c=local");
      expect(local.key).to.equal("local");
    });
  });

  // Test calls to browse_local()
  it('browse_local should return a list of radio stations', function() {
    let tunein = new TuneIn();
    let browse = tunein.browse_local();

    return browse.then(function(results) {
      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;

      let stationList = items[0];
      expect(stationList.element).to.equal("outline");
      expect(stationList.text).to.equal("Stations");
      expect(stationList.key).to.equal("stations");
      expect(stationList.children).to.be.an('array');

      let station = stationList.children[0];
      expect(station.element).to.equal("outline");
      expect(station.type).to.equal("audio");
      expect(station.item).to.equal("station");
    });
  });

  // Test calls to browse_music()
  it('browse_music should return a list of music genres', function() {
    let tunein = new TuneIn();
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
      expect(genre.URL).to.equal("http://opml.radiotime.com/Browse.ashx?id=" + guide_id);
    });
  });


  // Test calls to browse_talk
  it('browse_talk should return a list of talk music categories', function() {
    let tunein = new TuneIn();
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
      expect(genre.URL).to.equal("http://opml.radiotime.com/Browse.ashx?id=" + guide_id);
    });
  });

  // Test calls to browse_sports
  it('browse_sports should return a list of sport radio categories', function() {
    let tunein = new TuneIn();
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
      expect(genre.URL).to.equal("http://opml.radiotime.com/Browse.ashx?id=" + guide_id);
    });
  });

  // Test calls to browse_locations
  it('browse_locations should return a list of geographical areas', function() {
    let tunein = new TuneIn();
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
      expect(area.URL).to.equal("http://opml.radiotime.com/Browse.ashx?id=" + guide_id);
    });
  });


});
