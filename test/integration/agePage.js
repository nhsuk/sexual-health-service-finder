const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const mandatorySelectionMessage = require('../../app/lib/displayUtils/messages').mandatorySelectionMessage;
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const recommendRoute = `${constants.siteRoot}/recommend`;
const chooseRoute = `${constants.siteRoot}/choose`;

function expectAgePageAgain($) {
  expect($('.nhsuk-error-message').text()).to.contain(mandatorySelectionMessage());
  expect($('.local-header--title--question').text()).to.contains('How old are you?');
}

describe('Age page', () => {
  it('page title should be \'How old are you?\' if symptoms question is answered no', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.no });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.contains('How old are you?');
  });

  it('should not be indexed', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.no });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('meta[name=robots]').attr('content')).to.equal('noindex');
  });

  it('should return age page with an error message if age question is not answered', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectAgePageAgain($);
  });
});
