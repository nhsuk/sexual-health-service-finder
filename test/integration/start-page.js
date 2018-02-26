const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('page title', () => {
    it('should be \'Find a chlamydia test - NHS.UK\'', async () => {
      const res = await chai.request(server).get(`${constants.SITE_ROOT}`);

      const $ = cheerio.load(res.text);

      expect($('title').text()).to.equal('Find a chlamydia test - NHS.UK');
      expect($('.local-header--title--question').text()).to.equal('Find a chlamydia test');
    });
  });

  describe('return to Choices services', () => {
    it('should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(`${constants.SITE_ROOT}`);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
