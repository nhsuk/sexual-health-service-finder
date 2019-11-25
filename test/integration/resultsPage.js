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

describe('Results page results', () => {
  describe('page content', () => {
    const location = 'ls1';
    let $;

    setTypeAndOriginPairs().forEach((queryParams) => {
      const origin = queryParams.origin;
      const type = queryParams.type;

      before(`make request for type:${type} and origin:${origin}`, async () => {
        const searchOrigin = { location: { lat: 53.7974737203539, lon: -1.55262247079646 } };
        const queryType = getQueryType(type, origin);
        const query = queryBuilder(searchOrigin, queryType, 30);
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
    });

    describe('layout', () => {
      it('should not be indexed', () => {
        expect($('meta[name=robots]').attr('content')).to.equal('noindex');
      });
    });

    describe('Each service', () => {
      it('should have distance, a name, address and telephone number, a map link, See opening times toggle and See service information toggle', () => {
        const searchResultsDistance = $('.results__address.results__address-distance');
        const searchResultsName = $('.results__name');
        const searchResultsAddress = $('.results__address.results__address-lines');
        const searchResultsPhone = $('.results__telephone');
        const searchResultsMapLink = $('.results__item__link a');
        const searchResultsOpeningTimes = $('.nhsuk-details__summary-text');
        const searchResultsService = $('.results__item__service-details');

        expect(searchResultsOpeningTimes.text()).to.contain('Opening times');
        expect(searchResultsService.text()).to.contain('Service information');

        searchResultsMapLink.toArray().forEach((result, index) => {
          const name = getTextOnlyFromElement($('.results__name').eq(index));
          const address = getTextOnlyFromElement($('.results__address.results__address-lines').eq(index));
          const mapLinkText = $(result).text().replace('\n', '');
          expect(mapLinkText).to.equal(`Map and directions for ${name} at ${address}`);
        });

        expect(searchResultsDistance).to.have.lengthOf(30);
        expect(searchResultsName).to.have.lengthOf(30);
        expect(searchResultsAddress).to.have.lengthOf(30);
        expect(searchResultsPhone).to.have.lengthOf(30);
        expect(searchResultsMapLink).to.have.lengthOf(30);
      });
    });

    describe('matching results found', () => {
      it('should have 30 results', () => {
        const searchResults = $('.results__item--nearby');

        expect(searchResults.length).to.equal(30);
      });
    });
  });
});
