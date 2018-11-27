const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

function setTypeAndOriginPairs() {
  return [
    {
      origin: constants.serviceChoices.symptoms,
      type: constants.serviceTypes.professional,
    },
    {
      origin: constants.serviceChoices.under16,
      type: constants.serviceTypes.professional,
    },
    {
      origin: constants.serviceChoices['16to24'],
      type: constants.serviceTypes.professional,
    },
    {
      origin: constants.serviceChoices.over25,
      type: constants.serviceTypes.professional,
    },
  ];
}

function assertSearchResponse(location, done, assertions) {
  setTypeAndOriginPairs().forEach((queryParams) => {
    const origin = queryParams.origin;
    const type = queryParams.type;
    chai.request(app)
      .get(resultsRoute)
      .query({ location, origin, type })
      .end((err, res) => {
        expect(err).to.equal(null);
        iExpect.htmlWith200Status(res);
        assertions(err, res);
      });
  });
  done();
}

describe.skip('Results page results', function test() {
  this.timeout(2000);

  const location = 'ls1';

  describe('layout', () => {
    it('should contain HTML', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        iExpect.htmlWith200Status(res);
      });
    });

    it('should not be indexed', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        const $ = cheerio.load(res.text);
        expect($('meta[name=robots]').attr('content')).to.equal('noindex');
      });
    });
  });

  describe('Each service', () => {
    it('should have distance, a name, address and telephone number, a map link, See opening times toggle and See service information toggle', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResultsDistance = $('.results__address.results__address-distance');
        const searchResultsName = $('.results__name');
        const searchResultsAddress = $('.results__address.results__address-lines');
        const searchResultsPhone = $('.results__address.results__telephone a');
        const searchResultsMapLink = $('.results__item__link a');
        const searchResultsOpeningTimes = $('.results__item__opening-times a');
        const searchResultsService = $('.results__item__service-details a');

        expect(searchResultsDistance).to.not.equal(undefined);
        expect(searchResultsName).to.not.equal(undefined);
        expect(searchResultsAddress).to.not.equal(undefined);
        expect(searchResultsPhone).to.not.equal(undefined);
        expect(searchResultsOpeningTimes.text()).to.contain('See opening times'.repeat(30));
        expect(searchResultsService.text()).to.contain('See service information'.repeat(30));

        searchResultsMapLink.toArray().forEach((result, index) => {
          const name = $(searchResultsName.toArray()[index]).text().trim().replace('\n', '');
          const address = $(searchResultsAddress.toArray()[index]).text().trim().replace('\n', '');
          const mapLinkText = $(result).text().replace('\n', '');
          expect(mapLinkText).to.contain(`See map and directions for ${name} at ${address}`);
        });

        expect(searchResultsDistance).to.have.lengthOf(30);
        expect(searchResultsName).to.have.lengthOf(30);
        expect(searchResultsAddress).to.have.lengthOf(30);
        expect(searchResultsPhone).to.have.lengthOf(30);
        expect(searchResultsMapLink).to.have.lengthOf(30);
      });
    });
  });

  describe('matching results found', () => {
    it('should have 30 results', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby');

        expect(searchResults.length).to.equal(30);
      });
    });
  });
});
