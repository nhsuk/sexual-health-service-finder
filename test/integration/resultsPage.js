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

describe('Results page results', function test() {
  this.timeout(2000);

  const location = 'ls1';
  let res;

  setTypeAndOriginPairs().forEach((queryParams) => {
    before('make request', async () => {
      const origin = queryParams.origin;
      const type = queryParams.type;
      res = await chai.request(app)
        .get(resultsRoute)
        .query({ location, origin, type });
    });
  });

  describe('layout', () => {
    it('should contain HTML', () => {
      iExpect.htmlWith200Status(res);
    });

    it('should not be indexed', () => {
      const $ = cheerio.load(res.text);
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });
  });

  describe('Each service', () => {
    it('should have distance, a name, address and telephone number, a map link, See opening times toggle and See service information toggle', () => {
      const $ = cheerio.load(res.text);
      // TODO: Add back when function in place
      // const searchResultsDistance = $('.results__address.results__address-distance');
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

      // expect(searchResultsDistance).to.have.lengthOf(30);
      expect(searchResultsName).to.have.lengthOf(30);
      expect(searchResultsAddress).to.have.lengthOf(30);
      expect(searchResultsPhone).to.have.lengthOf(30);
      expect(searchResultsMapLink).to.have.lengthOf(30);
    });
  });

  describe('matching results found', () => {
    it('should have 30 results', () => {
      const $ = cheerio.load(res.text);
      const searchResults = $('.results__item--nearby');

      expect(searchResults.length).to.equal(30);
    });
  });
});
