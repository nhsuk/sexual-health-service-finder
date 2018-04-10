const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const messages = require('../../app/lib/messages');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

async function assertMapping(args, expectedMessage1, expectedMessage2) {
  const res = await chai.request(server)
    .get(`${constants.siteRoot}/location`)
    .query(args);

  const $ = cheerio.load(res.text);

  expect($('title').text()).to.equal('Find a chlamydia test - NHS.UK');
  expect($('.local-header--title--question').text()).to.equal(expectedMessage1);
  if (expectedMessage2) {
    expect($('.local-header--error.error-summary-heading').text()).to.contain(expectedMessage2);
  }
}

describe('Location page', () => {
  describe('accessed via journey', () => {
    it('should not be indexed', async () => {
      const res = await chai.request(server)
        .get(`${constants.siteRoot}/location`)
        .query({
          origin: constants.serviceChoices.under16,
          type: constants.serviceTypes.professional,
        });
      const $ = cheerio.load(res.text);
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });

    it('should ask for location of sexual health professionals for under 16 year olds', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.under16, type: constants.serviceTypes.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people with symptoms', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.symptoms, type: constants.serviceTypes.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people between 16 and 24', async () => {
      await assertMapping(
        { origin: constants.serviceChoices['16to24'], type: constants.serviceTypes.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people over 25', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.over25, type: constants.serviceTypes.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of free kits for people between 16 and 24', async () => {
      await assertMapping(
        { origin: constants.serviceChoices['16to24'], type: constants.serviceTypes.kit },
        'Where would you like to collect your free test kit?'
      );
    });

    it('should ask for location of paid kits for people over 25', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.over25, type: constants.serviceTypes.kit },
        'Where would you like to buy your test kit?'
      );
    });
  });

  describe('accessed via url', () => {
    it('should return an error page if there are no parameters', async () => {
      await assertMapping(
        {},
        'Find a chlamydia test',
        messages.invalidUrlMessage()
      );
    });

    it('should return an error page if there are parameters missing', async () => {
      await assertMapping(
        { type: constants.serviceTypes.kit },
        'Find a chlamydia test',
        messages.invalidUrlMessage()
      );
    });

    it('should return an error page for a combination of kits and under 16 parameters', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.under16, type: constants.serviceTypes.kit },
        'Find a chlamydia test',
        messages.invalidUrlMessage()
      );
    });

    it('should return an error page for a combination of kits and symptoms parameters', async () => {
      await assertMapping(
        { origin: constants.serviceChoices.symptoms, type: constants.serviceTypes.kit },
        'Find a chlamydia test',
        messages.invalidUrlMessage()
      );
    });
  });
});
