const expect = require('chai').expect;
const formatTimeString = require('../../../../app/lib/formatters/formatTimeString');

describe('formatTimeString', () => {
  describe('24 hour to 12 hour', () => {
    it('should format time before 12:00 as \'am\'', () => {
      const result = formatTimeString('08:30');
      expect(result).to.equal('8:30am');
    });

    it('should format time after 12:00 as \'pm\'', () => {
      const result = formatTimeString('18:30');
      expect(result).to.equal('6:30pm');
    });
  });

  describe('displaying minutes', () => {
    it('should display minutes if time is past the hour', () => {
      const result = formatTimeString('13:30');
      expect(result).to.equal('1:30pm');
    });

    it('should not display minutes if time is on the hour', () => {
      const result = formatTimeString('13:00');
      expect(result).to.equal('1pm');
    });
  });

  describe('handling midnight', () => {
    it('should display \'23:59\' as \'midnight\'', () => {
      const result = formatTimeString('23:59');
      expect(result).to.equal('midnight');
    });
    it('should display \'00:00\' as \'midnight\'', () => {
      const result = formatTimeString('00:00');
      expect(result).to.equal('midnight');
    });
  });
});
