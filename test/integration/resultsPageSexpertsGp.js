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

describe('Results page for sexual health professionals (symptoms and under16)', function test() {
  this.timeout(2000);

  const location = 'ls1';

  describe('layout', () => {
    it('should contain a header and other info related to the search', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        const $ = cheerio.load(res.text);
        const resultsHeader = getTextOnlyFromElement($('.nhsuk-page-heading'));
        const resultsSubHeader = getTextOnlyFromElement($('.results p.explanation'));
        const resultsOnwards = getTextOnlyFromElement($('.results p.links'));
        const resultsOnwards1 = getTextOnlyFromElement($('.results p.link1'));
        const resultsOnwards2 = getTextOnlyFromElement($('.results p.link2'));

        expect(resultsHeader).to.equal(`Sexual health professionals near '${location.toUpperCase()}'`);
        expect(resultsSubHeader).to.equal('You can get tested for chlamydia at these places.');
        expect(resultsOnwards).to.be.empty;
        expect(resultsOnwards1).to.be.empty;
        expect(resultsOnwards2).to.be.empty;
      });
    });
  });

  describe('matching sexual health professionals found', () => {
    describe('multiple matches', () => {
      it('should have more than one result', (done) => {
        assertSearchResponse(location, done, (err, res) => {
          const $ = cheerio.load(res.text);
          const searchResults = $('.results__item--nearby');

          expect(searchResults.length).to.equal(30);
        });
      });
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address and phone number', (done) => {
      assertSearchResponse(location, done, (err, res) => {
        const $ = cheerio.load(res.text);
        // TODO: Add back when function in place
        // const searchResultsDistance =
        // getTextOnlyFromElement($('.results__address.results__address-distance').first());
        const searchResultsName = getTextOnlyFromElement($('.results__name').first());
        const searchResultsAddress = getTextOnlyFromElement($('.results__address.results__address-lines').first());
        const searchResultsPhone = getTextOnlyFromElement($('.results__address.results__telephone a').first());

        // expect(searchResultsDistance).to.equal('0.5 miles away');
        expect(searchResultsName).to.equal('Leeds Sexual Health @ The Merrion Centre');
        expect(searchResultsAddress).to.equal('Merrion Centre - 1st Floor, 50 Merrion Way, Leeds, West Yorkshire, LS2 8NG');
        expect(searchResultsPhone).to.equal('0113 392 0333');
      });
    });
  });
});
