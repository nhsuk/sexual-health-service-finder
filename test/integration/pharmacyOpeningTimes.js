const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getQueryType = require('../../app/lib/utils/queryMapper').getQueryType;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/search/serviceSearchQueryBuilder');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

function assertTableTitles(firstTable) {
  const firstRowCells = firstTable.children('tr').eq('0').children();
  const header1 = firstRowCells.eq(0).text();
  const header2 = firstRowCells.eq(1).text();
  expect(header1).to.equal('Day of the week');
  expect(header2).to.equal('Opening hours');
}

function assertTimes(firstTable, row, day, firstSession, secondSession) {
  const firstRowCells = firstTable.children('tr').eq(row).children();
  expect(firstRowCells.eq(0).text()).to.equal(day);
  expect(firstRowCells.eq(1).text()).to.equal(firstSession);
  if (secondSession) {
    const secondSessionCell = firstTable.children('tr').eq(row + 1).children().eq(0);
    expect(secondSessionCell.text()).to.equal(secondSession);
  }
}

function assertFirstOpeningTimes(res) {
  const $ = cheerio.load(res.text);
  const firstTable = $('table.openingTimes tbody').eq(0);

  assertTableTitles(firstTable);
  assertTimes(firstTable, 1, 'Monday', '8:30am to 1pm', '1:30pm to 6pm');
  assertTimes(firstTable, 3, 'Tuesday', '8:30am to 1pm', '1:30pm to 6pm');
  assertTimes(firstTable, 5, 'Wednesday', '8:30am to 1pm', '1:30pm to 6pm');
  assertTimes(firstTable, 7, 'Thursday', '8:30am to 12:30pm');
  assertTimes(firstTable, 8, 'Friday', '8:30am to 1pm', '1:30pm to 6pm');
  assertTimes(firstTable, 10, 'Saturday', 'Closed');
  assertTimes(firstTable, 11, 'Sunday', 'Closed');
}

describe('Pharmacy opening times', () => {
  const location = 's2';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices.over25;

  it('should display daily opening times for a pharmacy', async () => {
    const latLon = { location: { lat: 53.3695577231271, lon: -1.44810761237785 } };
    const queryType = getQueryType(type, origin);
    const query = queryBuilder(latLon, queryType, 30);
    const requestBody = JSON.stringify(query);
    const responsePath = `${location}-results.json`;

    nockRequests.postcodeSearch(location, 200, `outcodeResponse_${location}.json`);
    nockRequests.serviceSearch(requestBody, 200, responsePath);

    const res = await chai.request(app)
      .get(resultsRoute)
      .query({ location, origin, type });

    iExpect.htmlWith200Status(res);
    assertFirstOpeningTimes(res);
  });
});
