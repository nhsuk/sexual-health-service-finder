const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const asConfig = require('../../config/config').azureSearch;
const constants = require('../../app/lib/constants');
const getQueryType = require('../../app/lib/utils/queryMapper').getQueryType;
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/azuresearch/queryBuilder');

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
        const path = `/indexes/${asConfig.index}/docs/search`;
        const searchOrigin = { location: { lat: 53.7974737203539, lon: -1.55262247079646 } };
        const queryType = getQueryType(type, origin);
        const query = queryBuilder(searchOrigin, queryType, 30);
        const requestBody = JSON.stringify(query);
        const responsePath = `${location}-sexpert-results.json`;

        nockRequests.withResponseBody(path, requestBody, 200, responsePath);
        nockRequests.postcodesIO(`/outcodes/${location}`, 200, 'outcodeResponse_ls1.json');

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
        const searchResultsPhone = $('.results__address.results__telephone a');
        const searchResultsMapLink = $('.results__item__link a');
        const searchResultsOpeningTimes = $('.results__item__opening-times a');
        const searchResultsService = $('.results__item__service-details a');

        expect(searchResultsOpeningTimes.text()).to.equal('See opening times'.repeat(30));
        expect(searchResultsService.text()).to.equal('See service information'.repeat(30));

        searchResultsMapLink.toArray().forEach((result, index) => {
          const name = getTextOnlyFromElement($('.results__name').eq(index));
          const address = getTextOnlyFromElement($('.results__address.results__address-lines').eq(index));
          const mapLinkText = $(result).text().replace('\n', '');
          expect(mapLinkText).to.equal(`See map and directions for ${name} at ${address}`);
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

  describe('cross border locations', () => {
    it('should display results when a location crosses 2 countries, one of which is England', async () => {
      const type = constants.serviceTypes.kit;
      const origin = constants.serviceChoices.over25;
      const path = `/indexes/${asConfig.index}/docs/search`;
      const latLon = { location: { lat: 55.3977217554393, lon: -2.77657929395506 } };
      const queryType = getQueryType(type, origin);
      const query = queryBuilder(latLon, queryType, 30);
      const requestBody = JSON.stringify(query);
      const responsePath = `type-${type}-origin-${origin}-results.json`;

      const crossBorderOutcode = 'TD9';
      nockRequests.postcodesIO(`/outcodes/${crossBorderOutcode}`, 200, 'outcodeResponseCrossBorder_TD9.json');
      nockRequests.withResponseBody(path, requestBody, 200, responsePath);

      const res = await chai.request(app)
        .get(resultsRoute)
        .query({ location: crossBorderOutcode, origin, type });

      const $ = cheerio.load(res.text);

      const searchResults = $('.results__item--nearby');

      expect(searchResults.length).to.equal(30);
    });
  });
});
