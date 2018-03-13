const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const recommendRoute = `${constants.SITE_ROOT}/recommend`;
const chooseRoute = `${constants.SITE_ROOT}/choose`;

describe('Recommend page', () => {
  it('page title should be \'We recommend that you\' if symptoms question is answered yes', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: 'yes' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('We recommend that you');
  });

  it('page title should be \'We recommend that you\' if age question is answered 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '1' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('We recommend that you');
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(recommendRoute);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(recommendRoute);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
