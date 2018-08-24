const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

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

describe('Results page for kits in over 25 year olds', function test() {
  // Setting this timeout as it is calling the real DB...
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  const location = 'ls1';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices.over25;

  describe('layout', () => {
    it('should contain a header and other info related to the search', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = $('.local-header--title--question').text();
        const resultsSubHeader = $('.results p.explanation').text();
        const resultsOnwards = $('.results p.links').text();

        expect(resultsHeader).to.contain('Places you can buy a test kit near \'LS1\'');
        expect(resultsSubHeader).to.contain('You can buy a test kit from these places.');
        expect(resultsOnwards).to.contain('Or: see where you can get tested by a sexual health professional.');
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
        const searchResultsMapLink = $('.results__item__link a').first();
        const searchResultsOpeningTimes = $('.results__item__opening-times a').first();
        const searchResultsService = $('.results__item__service-details a').first();

        expect(searchResultsDistance).to.not.equal(undefined);
        expect(searchResultsName).to.not.equal(undefined);
        expect(searchResultsAddress).to.not.equal(undefined);
        expect(searchResultsPhone).to.not.equal(undefined);
        expect(searchResultsOpeningTimes.text()).to.contain('See opening times');
        expect(searchResultsService).to.not.equal(undefined);
        const name = searchResultsName.text().trim().replace('\n', '');
        const address = searchResultsAddress.text().trim().replace('\n', '');
        expect(name).to.contain('Ma Manning (Pharmacy) Ltd');
        expect(address).to.contain('97 Lidgett Lane');
        const mapLinkText = $(searchResultsMapLink).text().replace('\n', '');
        expect(mapLinkText).to.contain(`See map and directions for ${name} at ${address}`);
        expect(searchResultsDistance.text()).to.contain('3 miles away');
        expect(searchResultsPhone.text()).to.contain('0113 266 1786');
      });
    });
  });

  describe('matching results found', () => {
    it('should have 30 results', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby');

        expect(searchResults.length).to.equal(30);
      });
    });
  });
});
