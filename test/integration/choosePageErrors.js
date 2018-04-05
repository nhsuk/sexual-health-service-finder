const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseErrorRoute = `${constants.siteRoot}/location`;

describe('Choose page with error', () => {
  it('page errors should be \'You must choose one of the options.\' if errors and age is 16-24', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices['16to24'] });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.error-summary').text()).to.contain('You must choose one of the options.');
  });

  it('page title should be \'How do you want to get a test?\' if errors and age is 16-24', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices['16to24'] });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
  });

  it('page options should be related to being under 25 (free), if errors and age is 16-24', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices['16to24'] });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('Collect a free test kit near you');
  });

  it('page errors should be \'You must choose one of the options.\' if errors and age is over 25', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices.over25 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.error-summary').text()).to.contain('You must choose one of the options.');
  });

  it('page title should be \'How do you want to get a test?\' if errors and age is over 25', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices.over25 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
  });

  it('page options should be related to being over 25 (paid), if errors and age is over 25', async () => {
    const res = await chai.request(server)
      .get(chooseErrorRoute)
      .query({ origin: constants.serviceChoices.over25 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('See a sexual health professional for free near you');
  });
});
