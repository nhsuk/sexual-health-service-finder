/* eslint-disable sort-keys */
const expect = require('chai').expect;
const formatOpeningTimes = require('../../../../app/lib/utils/formatOpeningTimes');

function assertDayClosed(result, day) {
  expect(result.day).to.equal(day);
  expect(result.openingTimes).to.be.an('array').and.empty;
}

function assertDayWithSingleSession(result, day, opens1, closes1, numSessions) {
  expect(result.day).to.equal(day);
  expect(result.openingTimes).to.be.an('array');
  expect(result.openingTimes.length).to.equal(numSessions || 1);
  expect(result.openingTimes[0].opens).to.equal(opens1);
  expect(result.openingTimes[0].closes).to.equal(closes1);
}

function assertDayWithDoubleSession(result, day, opens1, closes1, opens2, closes2) {
  assertDayWithSingleSession(result, day, opens1, closes1, 2);
  expect(result.openingTimes[1].opens).to.equal(opens2);
  expect(result.openingTimes[1].closes).to.equal(closes2);
}

describe('formatOpeningTimes', () => {
  describe('happy path', () => {
    const openingTimes = [
      { Times: '08:00-15:00', WeekDay: 'Monday' },
      { Times: '16:00-17:00', WeekDay: 'Monday' },
      { Times: '09:00-15:00', WeekDay: 'Tuesday' },
      { Times: '16:00-18:00', WeekDay: 'Tuesday' },
      { Times: '10:00-15:00', WeekDay: 'Wednesday' },
      { Times: '16:00-19:00', WeekDay: 'Wednesday' },
      { Times: '11:00-15:00', WeekDay: 'Thursday' },
      { Times: '06:30-21:45', WeekDay: 'Friday' },
      { Times: '09:00-12:00', WeekDay: 'Saturday' },
    ];

    it('should return opening times for display, with times formatted and no sessions for days not specified', () => {
      const result = formatOpeningTimes(JSON.stringify(openingTimes));

      expect(result).to.be.an('array');
      assertDayWithDoubleSession(result[0], 'Monday', '8am', '3pm', '4pm', '5pm');
      assertDayWithDoubleSession(result[1], 'Tuesday', '9am', '3pm', '4pm', '6pm');
      assertDayWithDoubleSession(result[2], 'Wednesday', '10am', '3pm', '4pm', '7pm');
      assertDayWithSingleSession(result[3], 'Thursday', '11am', '3pm');
      assertDayWithSingleSession(result[4], 'Friday', '6:30am', '9:45pm');
      assertDayWithSingleSession(result[5], 'Saturday', '9am', '12pm');
      assertDayClosed(result[6], 'Sunday');
    });

    it('should return all days of the week when none are specified', () => {
      const openingTimesClosedAllWeek = [];

      const result = formatOpeningTimes(JSON.stringify(openingTimesClosedAllWeek));

      expect(result).to.exist;
      expect(result).to.be.an('array');
      expect(result.length).to.equal(7);
      expect(result[0].day).to.equal('Monday');
      expect(result[1].day).to.equal('Tuesday');
      expect(result[2].day).to.equal('Wednesday');
      expect(result[3].day).to.equal('Thursday');
      expect(result[4].day).to.equal('Friday');
      expect(result[5].day).to.equal('Saturday');
      expect(result[6].day).to.equal('Sunday');
      expect(result[0].openingTimes).to.be.an('array').and.empty;
      expect(result[1].openingTimes).to.be.an('array').and.empty;
      expect(result[2].openingTimes).to.be.an('array').and.empty;
      expect(result[3].openingTimes).to.be.an('array').and.empty;
      expect(result[4].openingTimes).to.be.an('array').and.empty;
      expect(result[5].openingTimes).to.be.an('array').and.empty;
      expect(result[6].openingTimes).to.be.an('array').and.empty;
    });
  });

  describe('error conditions', () => {
    it('should return undefined when incorrectly formatted JSON is specified', () => {
      const result = formatOpeningTimes('[{]');

      expect(result).to.be.undefined;
    });
  });
});
/* eslint-enable sort-keys */
