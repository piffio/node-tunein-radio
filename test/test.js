'use strict';

var expect = require('chai').expect;
var TuneIn = require('../index');

describe('#tuneinRadio', function() {
  it('should return main categories when browsing with no parameters', function() {
    let tunein = new TuneIn();
    let browse = tunein.browse();

    browse.then(function(results) {
      let title = results.head.title;
      expect(title).to.equal('Browse');

      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items.length).to.equal(7);

      let local = results.body[0];
      expect(local.element).to.equal("outline");
      expect(local.type).to.equal("link");
      expect(local.text).to.equal("Local Radio");
      expect(local.URL).to.equal("http://opml.radiotime.com/Browse.ashx?c=local");
      expect(local.key).to.equal("local");
    });
  });

  it('browse_local should return a list of radio stations', function() {
    let tunein = new TuneIn();
    let browse = tunein.browse();

    browse.then(function(results) {
      let status = results.head.status;
      expect(status).to.equal('200');

      let items = results.body;
      expect(items).to.have.lengthOf(1);

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
});
