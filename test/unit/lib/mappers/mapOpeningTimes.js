const chai = require('chai');
const mapOpeningTimes = require('../../../../app/lib/mappers/mapOpeningTimes');

const expect = chai.expect;

describe('mapOpeningTimes', () => {
  describe('when OpeningTimes is populated', () => {
    const monday = 'Monday';
    const tuesday = 'Tuesday';
    const mondayOpens = '08:00';
    const tuesdayOpens = '09:00';
    const mondayCloses = '18:00';
    const tuesdayCloses = '17:00';
    const rawOpeningTimes = [
      { Times: `${mondayOpens}-${mondayCloses}`, WeekDay: monday },
      { Times: `${tuesdayOpens}-${tuesdayCloses}`, WeekDay: tuesday },
    ];
    const service = {
      OpeningTimes: JSON.stringify(rawOpeningTimes),
    };

    it('should return object with formatted property', () => {
      const result = mapOpeningTimes(service);

      expect(result).to.not.be.undefined;
      expect(result.formatted).to.not.be.undefined;
      const openingTimes = result.formatted;
      expect(openingTimes).to.not.be.undefined;
      expect(openingTimes).to.be.an('array');
      expect(openingTimes.length).to.equal(7);
      expect(openingTimes[0].day).to.equal(monday);
      expect(openingTimes[0].openingTimes).to.be.an('array');
      expect(openingTimes[0].openingTimes.length).to.equal(1);
      expect(openingTimes[0].openingTimes[0].opens).to.equal(mondayOpens);
      expect(openingTimes[0].openingTimes[0].closes).to.equal(mondayCloses);
      expect(openingTimes[1].day).to.equal(tuesday);
      expect(openingTimes[1].openingTimes).to.be.an('array');
      expect(openingTimes[1].openingTimes.length).to.equal(1);
      expect(openingTimes[1].openingTimes[0].opens).to.equal(tuesdayOpens);
      expect(openingTimes[1].openingTimes[0].closes).to.equal(tuesdayCloses);
      expect(openingTimes[2].day).to.equal('Wednesday');
      expect(openingTimes[2].openingTimes).to.be.an('array').and.empty;
      expect(openingTimes[3].day).to.equal('Thursday');
      expect(openingTimes[3].openingTimes).to.be.an('array').and.empty;
      expect(openingTimes[4].day).to.equal('Friday');
      expect(openingTimes[4].openingTimes).to.be.an('array').and.empty;
      expect(openingTimes[5].day).to.equal('Saturday');
      expect(openingTimes[5].openingTimes).to.be.an('array').and.empty;
      expect(openingTimes[6].day).to.equal('Sunday');
      expect(openingTimes[6].openingTimes).to.be.an('array').and.empty;
    });
  });

  describe('when OpeningTimes is empty and GSD is populated', () => {
    it('should return an object with a description property', () => {
      const openingTimesText = 'Some text describing the opening times';
      const serviceDetails = [
        { ElementText: openingTimesText, ElementTitle: 'Opening times' },
      ];

      const service = {
        GSD: JSON.stringify(serviceDetails),
      };

      const result = mapOpeningTimes(service);

      expect(result).to.not.be.undefined;
      expect(result.description).to.not.be.undefined;
      expect(result.description).to.equal(openingTimesText);
    });
  });

  describe('when OpeningTimes and GSD are empty', () => {
    it('should return undefined', () => {
      const result = mapOpeningTimes({});

      expect(result).to.be.undefined;
    });
  });

  describe('GSD with no detail properties to map from', () => {
    const result = mapOpeningTimes({ GSD: JSON.stringify([]) });

    it('should return undefined', () => {
      expect(result).to.be.undefined;
    });
  });

  describe('invalid JSON GSD', () => {
    it('should return undefined', () => {
      const result = mapOpeningTimes({ GSD: '[{]' });

      expect(result).to.be.undefined;
    });
  });
});
