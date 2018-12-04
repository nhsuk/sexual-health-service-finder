const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getQueryType = require('../../app/lib/utils/queryMapper').getQueryType;
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/search/queryBuilder');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

describe('Results page for kits for 16 to 24 year olds', () => {
  const location = 'ls1';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices['16to24'];
  let $;

  before('make request', async () => {
    const path = '/service-search/search';
    const latLon = { location: { lat: 53.7974737203539, lon: -1.55262247079646 } };
    const queryType = getQueryType(type, origin);
    const query = queryBuilder(latLon, queryType, 30);
    const requestBody = JSON.stringify(query);
    const responsePath = `type-${type}-origin-${origin}-results.json`;

    nockRequests.withResponseBody(path, requestBody, 200, responsePath);
    nockRequests.postcodesIO(`/outcodes/${location}`, 200, 'outcodeResponse_ls1.json');

    const res = await chai.request(app)
      .get(resultsRoute)
      .query({ location, origin, type });

    iExpect.htmlWith200Status(res);
    $ = cheerio.load(res.text);
  });

  describe('layout', () => {
    it('should contain a header and other info related to the search', () => {
      const resultsHeader = getTextOnlyFromElement($('.nhsuk-page-heading'));
      const resultsSubHeader = $('.results p.explanation').text();
      const resultsOnwards1 = $('.results li.link1').text();
      const resultsOnwards2 = $('.results li.link2').text();

      expect(resultsHeader).to.equal(`Places you can collect a free test kit near '${location.toUpperCase()}'`);
      expect(resultsSubHeader).to.equal('You can get a free chlamydia test kit from these places.');
      expect(resultsOnwards1).to.equal('order a free test kit online');
      expect(resultsOnwards2).to.equal('see where you can get tested by a sexual health professional');
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address, phone number, a map link, See opening times toggle and See service information toggle', () => {
      const distance = getTextOnlyFromElement($('.results__address.results__address-distance').first());
      const name = getTextOnlyFromElement($('.results__name').first());
      const address = getTextOnlyFromElement($('.results__address.results__address-lines').first());
      const phone = getTextOnlyFromElement($('.results__address.results__telephone a').first());
      const mapLink = getTextOnlyFromElement($('.results__item__link a').first());
      const openingTimes = getTextOnlyFromElement($('.results__item__opening-times a').first());
      const serviceInfo = getTextOnlyFromElement($('.results__item__service-details a').first());

      expect(openingTimes).to.equal('See opening times');
      expect(serviceInfo).to.equal('See service information');
      expect(phone).to.equal('0113 244 4209');
      expect(name).to.equal('MESMAC - Leeds');
      expect(address).to.equal('22/23 Blayds Yard, Leeds, West Yorkshire, LS1 4AD');
      expect(mapLink).to.equal(`See map and directions for ${name} at ${address}`);
      expect(distance).to.equal(`${name} is 0.4 miles away`);
    });
  });

  describe('matching results found', () => {
    it('should have 30 results', () => {
      const searchResults = $('.results__item--nearby');

      expect(searchResults.length).to.equal(30);
    });
  });
});
