const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseRoute = `${constants.SITE_ROOT}/choose`;

describe('Choose page', () => {
  it('page title should be \'How do you want to get a test?\' if age question is answered 16-24', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '2' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
  });

  it('page title should be \'How do you want to get a test?\' if age question is answered 25 or older', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '3' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(chooseRoute);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(chooseRoute);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
