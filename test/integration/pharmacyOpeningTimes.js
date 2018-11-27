const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;
chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results/`;

function assertSearchResponse(location, type, origin, done, assertions) {
  chai.request(app)
    .get(resultsRoute)
    .query({ location, origin, type })
    .end((err, res) => {
      expect(err).to.equal(null);
      console.log(res);
      iExpect.htmlWith200Status(res);
      assertions(err, res);
      done();
    });
}

function assertTableTitles(firstTable) {
  const firstRowCells = firstTable.children('tr').eq('0').children();
  const header1 = firstRowCells.eq(0).text();
  const header2 = firstRowCells.eq(1).text();
  expect(header1).to.equal('Day of the week');
  expect(header2).to.equal('Opening hours');
}

function assertTimes(firstTable, row, day, times) {
  const firstRowCells = firstTable.children('tr').eq(row).children();
  const cell1 = firstRowCells.eq(0).text();
  const cell2 = firstRowCells.eq(1).text();
  expect(cell1).to.equal(day);
  expect(cell2).to.equal(times);
}

function assertFirstOpeningTimes(res) {
  const $ = cheerio.load(res.text);
  const firstTable = $('table.openingTimes tbody').eq(0);
  assertTableTitles(firstTable);
  assertTimes(firstTable, 1, 'Monday', '9am to 6pm');
  assertTimes(firstTable, 2, 'Tuesday', '9am to 6pm');
  assertTimes(firstTable, 3, 'Wednesday', '9am to 6pm');
  assertTimes(firstTable, 4, 'Thursday', '9am to 6pm');
  assertTimes(firstTable, 5, 'Friday', '9am to 6pm');
  assertTimes(firstTable, 6, 'Saturday', '9am to 1pm');
  assertTimes(firstTable, 7, 'Sunday', 'Closed');
}

describe('Pharmacy opening times', function test() {
  this.timeout(2000);

  const location = 'ls1';
  const type = constants.serviceTypes.kit;
  const origin = constants.serviceChoices.over25;

  it('should display daily opening times for a pharmacy', (done) => {
    assertSearchResponse(location, type, origin, done, (err, res) => {
      assertFirstOpeningTimes(res);
    });
  });
});
