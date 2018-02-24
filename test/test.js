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
});
