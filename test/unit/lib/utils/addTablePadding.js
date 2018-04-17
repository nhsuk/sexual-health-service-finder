/* eslint-disable sort-keys */
const expect = require('chai').expect;
const addTablePadding = require('../../../../app/lib/utils/addTablePadding');

const openingTimes = [
  { day: 'Monday', openingTimes: [{ opens: '8am', closes: '3pm' }, { opens: '4pm', closes: '5pm' }] },
  { day: 'Tuesday', openingTimes: [{ opens: '9am', closes: '3pm' }, { opens: '4pm', closes: '6pm' }] },
  { day: 'Wednesday', openingTimes: [{ opens: '10am', closes: '3pm' }, { opens: '4pm', closes: '7pm' }] },
  { day: 'Thursday', openingTimes: [{ opens: '11am', closes: '3pm' }, { opens: '4pm', closes: '8pm' }] },
  { day: 'Friday', openingTimes: [{ opens: '12pm', closes: '3pm' }, { opens: '4pm', closes: '9pm' }] },
  { day: 'Saturday', openingTimes: [{ opens: '1pm', closes: '3pm' }] },
  { day: 'Sunday', openingTimes: [] },
];

describe('addTableMarkup', () => {
  it('should add padding to columns with fewer items', () => {
    const result = addTablePadding(openingTimes);
    expect(result[0].padding).to.be.undefined;
    expect(result[1].padding).to.be.undefined;
    expect(result[2].padding).to.be.undefined;
    expect(result[3].padding).to.be.undefined;
    expect(result[4].padding).to.be.undefined;
    expect(result[5].padding).to.equal(1);
    expect(result[6].padding).to.equal(2);
  });

  it('should handle undefined openingTimes', () => {
    const result = addTablePadding(undefined);
    expect(result).to.be.undefined;
  });

  it('should handle undefined openingTimes on day', () => {
    const times = [
      { day: 'Monday' },
      { day: 'Tuesday', openingTimes: [{ opens: '9am', closes: '3pm' }] },
    ];

    const result = addTablePadding(times);
    expect(result[0].openingTimes).to.be.undefined;
    expect(result[0].padding).to.equal(1);
  });
});
/* eslint-enable sort-keys */
