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

describe('Results page for sexual health professionals for 16 to 24', function test() {
  this.timeout(2000);

  const location = 'ls1';
  const type = constants.serviceTypes.professional;
  const origin = constants.serviceChoices['16to24'];
  let res;

  before('make request', async () => {
    res = await chai.request(app)
      .get(resultsRoute)
      .query({ location, origin, type });
  });

  describe('layout', () => {
    it('should contain HTML', () => {
      iExpect.htmlWith200Status(res);
    });

    it('should contain a header and other info related to the search', () => {
      const $ = cheerio.load(res.text);
      const resultsHeader = getTextOnlyFromElement($('.nhsuk-page-heading'));
      const resultsSubHeader = getTextOnlyFromElement($('.results p.explanation'));
      const resultsOnwards1 = getTextOnlyFromElement($('.results li.link1'));
      const resultsOnwards2 = getTextOnlyFromElement($('.results li.link2'));

      expect(resultsHeader).to.equal(`Sexual health professionals near '${location.toUpperCase()}'`);
      expect(resultsSubHeader).to.equal('You can get tested for chlamydia at these places.');
      expect(resultsOnwards1).to.equal('see where you can collect a free test kit');
      expect(resultsOnwards2).to.equal('order a free test kit online');
    });
  });

  describe('matching sexual health professionals found', () => {
    describe('multiple matches', () => {
      it('should have more than one result', () => {
        const $ = cheerio.load(res.text);
        const searchResults = $('.results__item--nearby');

        expect(searchResults.length).to.equal(30);
      });
    });
  });

  describe('First service', () => {
    it('should have distance, name, an address and phone number', () => {
      const $ = cheerio.load(res.text);
      // TODO: Add back when function in place
      // const searchResultsDistance =
      // getTextOnlyFromElement($('.results__address.results__address-distance').first());
      const searchResultsName = getTextOnlyFromElement($('.results__name').first());
      const searchResultsAddress = getTextOnlyFromElement($('.results__address.results__address-lines').first());
      const searchResultsPhone = getTextOnlyFromElement($('.results__address.results__telephone a').first());

      // expect(searchResultsDistance).to.not.equal(undefined);
      expect(searchResultsName).to.not.equal(undefined);
      expect(searchResultsAddress).to.not.equal(undefined);
      expect(searchResultsPhone).to.not.equal(undefined);

      // expect(searchResultsDistance).to.equal('0.5 miles away');
      expect(searchResultsName).to.equal('Leeds Sexual Health @ The Merrion Centre');
      expect(searchResultsAddress).to.equal('Merrion Centre - 1st Floor, 50 Merrion Way, Leeds, West Yorkshire, LS2 8NG');
      expect(searchResultsPhone).to.equal('0113 392 0333');
    });
  });
});
