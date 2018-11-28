const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const iExpect = require('../lib/expectations');

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
  this.timeout(2000);

  const location = 'ls8';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices.over25;

  describe('layout', () => {
    it('should contain a header and other info related to the search', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = getTextOnlyFromElement($('.nhsuk-page-heading'));
        const resultsSubHeader = getTextOnlyFromElement($('.results p.explanation'));
        const resultsOnwards = getTextOnlyFromElement($('.results p.links'));

        expect(resultsHeader).to.equal(`Places you can buy a test kit near '${location.toUpperCase()}'`);
        expect(resultsSubHeader).to.equal('You can buy a test kit from these places.');
        expect(resultsOnwards).to.equal('Or: see where you can get tested by a sexual health professional.');
      });
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address and phone number', (done) => {
      assertSearchResponse(location, type, origin, done, (err, res) => {
        const $ = cheerio.load(res.text);
        // const distance =
        // getTextOnlyFromElement($('.results__address.results__address-distance'));
        const name = getTextOnlyFromElement($('.results__name').first());
        const address = getTextOnlyFromElement($('.results__address.results__address-lines').first());
        const telephone = getTextOnlyFromElement($('.results__address.results__telephone a').first());
        const mapLink = getTextOnlyFromElement($('.results__item__link a').first());
        const openingTimes = getTextOnlyFromElement($('.results__item__opening-times a').first());
        const serviceInfo = getTextOnlyFromElement($('.results__item__service-details a').first());

        expect(openingTimes).to.equal('See opening times');
        expect(serviceInfo).to.equal('');
        expect(name).to.equal('Ma Manning (Pharmacy) Ltd');
        expect(address).to.equal('97 Lidgett Lane, Leeds, Leeds, West Yorkshire, LS8 1QR');
        expect(mapLink).to.equal(`See map and directions for ${name} at ${address}`);
        // TODO: Add back when function implemented
        // expect(distance.text()).to.equal('3 miles away');
        expect(telephone).to.equal('0113 266 1786');
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
