const chai = require('chai');
const nock = require('nock');

const log = require('../app/lib/logger');

const expect = chai.expect;

after('Check all nocks have been called. This is due to incorrectly \'nocked\' requests. Have any requests been changed or added?', () => {
  try {
    log.fatal(nock.pendingMocks());
    expect(nock.pendingMocks().length).to.equal(0);
    expect(nock.isDone()).to.equal(true);
  } finally {
    nock.cleanAll();
  }
});
