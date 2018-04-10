const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const utils = require('../lib/testUtils');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

function assertSearchResponse(location, type, origin, done, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ location, origin, type })
    .end((err, res) => {
      expect(err).to.equal(null);
      iExpect.htmlWith200Status(res);
      assertions(err, res);
      done();
    });
}

describe('Results page for kits for 16 to 24 year olds', function test() {
  // Setting this timeout as it is calling the real DB...
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  const location = 'ls1';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices['16to24'];

  describe('layout', () => {
    it('should contain a header and other info related to the search', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = $('.local-header--title--question').text();
        const resultsSubHeader = $('.results p.explanation').text();
        const resultsOnwards = $('.results p.links').text();
        const resultsOnwards1 = $('.results p.link1').text();
        const resultsOnwards2 = $('.results p.link2').text();

        expect(resultsHeader).to.contain('Places you can collect a free test kit near \'LS1\'');
        expect(resultsSubHeader).to.contain('Here is a list of places where you can get a free chlamydia test kit.');
        expect(resultsOnwards1).to.contain('If you want a kit delivered to you, you can find a free test kit online.');
        expect(resultsOnwards2).to.contain('You can also see places where you can get tested by a sexual health professional.');
        expect(resultsOnwards).to.be.empty;
      });
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address and phone number', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResultsDistance = $('.results__address.results__address-distance').first();
        const searchResultsName = $('.results__name').first();
        const searchResultsAddress = $('.results__address.results__address-lines').first();
        const searchResultsPhone = $('.results__address.results__telephone a').first();

        expect(searchResultsDistance).to.not.equal(undefined);
        expect(searchResultsName).to.not.equal(undefined);
        expect(searchResultsAddress).to.not.equal(undefined);
        expect(searchResultsPhone).to.not.equal(undefined);

        expect(searchResultsDistance.text()).to.contain('Distance: 0.45 miles');
        expect(searchResultsName.text()).to.contain('MESMAC - Leeds');
        expect(searchResultsAddress.text()).to.contain('22/23 Blayds Yard');
        expect(searchResultsPhone.text()).to.contain('0113 244 4209');
      });
    });
  });
});
