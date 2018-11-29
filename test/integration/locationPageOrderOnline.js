const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const locationRoute = `${constants.siteRoot}/location/`;

describe('Location page for ordering kits online for 16 to 24 year olds', function test() {
  this.timeout(2000);

  const type = constants.serviceTypes.online;
  const origin = constants.serviceChoices['16to24'];
  let res;

  before('make request', async () => {
    res = await chai.request(app)
      .get(locationRoute)
      .query({ origin, type });

    iExpect.htmlWith200Status(res);
  });

  describe('response', () => {
    it('should be the live \'Chlamydia - free online tests for u-25s\' service search', () => {
      const $ = cheerio.load(res.text);
      const resultsHeader = getTextOnlyFromElement($('h1'));

      expect(res.redirects[0]).to.equal('https://www.nhs.uk/Service-Search/Chlamydia-free-online-tests-for-u-25s/LocationSearch/344');
      expect(resultsHeader).to.contain('Find Chlamydia - free online tests for u-25s services');
    });
  });
});
