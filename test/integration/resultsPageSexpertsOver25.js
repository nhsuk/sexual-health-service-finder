const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getQueryType = require('../../app/lib/utils/queryMapper').getQueryType;
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/search/serviceSearchQueryBuilder');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

describe('Results page for sexual health professionals for over 25', () => {
  const location = 'ls1';
  const type = constants.serviceTypes.professional;
  const origin = constants.serviceChoices.over25;
  let $;

  before('make request', async () => {
    const latLon = { location: { lat: 53.7974737203539, lon: -1.55262247079646 } };
    const queryType = getQueryType(type, origin);
    const query = queryBuilder(latLon, queryType, 30);
    const requestBody = JSON.stringify(query);
    const responsePath = `${location}-sexpert-results.json`;

    nockRequests.postcodeSearch(location, 200, `outcodeResponse_${location}.json`);
    nockRequests.serviceSearch(requestBody, 200, responsePath);
    const res = await chai.request(app)
      .get(resultsRoute)
      .query({ location, origin, type });

    iExpect.htmlWith200Status(res);
    $ = cheerio.load(res.text);
  });

  describe('layout', () => {
    it('should contain a header and other info related to the search', () => {
      const resultsHeader = getTextOnlyFromElement($('h1'));
      const resultsSubHeader = getTextOnlyFromElement($('.results p.explanation'));
      const resultsOnwards = getTextOnlyFromElement($('.results p.links'));

      expect(resultsHeader).to.equal('Sexual health professionals near \'LS1\'');
      expect(resultsSubHeader).to.equal('You can get tested for chlamydia at these places.');
      expect(resultsOnwards).to.equal('Or: see where you can buy a test kit.');
    });
  });

  describe('matching sexual health professionals found', () => {
    describe('multiple matches', () => {
      it('should have more than one result', () => {
        const searchResults = $('.results__item--nearby');

        expect(searchResults.length).to.equal(30);
      });
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address and phone number', () => {
      const searchResultsDistance = getTextOnlyFromElement($('.results__address.results__address-distance').first());
      const searchResultsName = getTextOnlyFromElement($('.results__name').first());
      const searchResultsAddress = getTextOnlyFromElement($('.results__address.results__address-lines').first());
      const searchResultsPhone = getTextOnlyFromElement($('.results__address.results__telephone a').first());

      expect(searchResultsDistance).to.equal(`${searchResultsName} is 0.5 miles away`);
      expect(searchResultsName).to.equal('Leeds Sexual Health @ The Merrion Centre');
      expect(searchResultsAddress).to.equal('Merrion Centre - 1st Floor, 50 Merrion Way, Leeds, West Yorkshire, LS2 8NG');
      expect(searchResultsPhone).to.equal('0113 392 0333');
    });
  });
});
