const chai = require('chai');
const extractProperty = require('../../../../app/lib/utils/extractProperty');

const expect = chai.expect;

describe('extractProperty', () => {
  const searchTargetValue = 'search target value';
  const extractionTargetValue = 'extraction target value';
  const SearchTargetKey = 'SearchTargetKey';
  const ExtractionTargetKey = 'ExtractionTargetKey';

  describe('happy path', () => {
    it('should return the targeted extraction property when a single object exists within JSON', () => {
      const obj = {};
      obj[SearchTargetKey] = searchTargetValue;
      obj[ExtractionTargetKey] = extractionTargetValue;
      const rawJSON = [obj];
      const targetJSON = JSON.stringify(rawJSON);

      const options = {
        extractionTargetKey: ExtractionTargetKey,
        searchTargetKey: SearchTargetKey,
        searchTargetValue,
      };

      const result = extractProperty(options, targetJSON);

      expect(result).to.equal(extractionTargetValue);
    });

    it('should return the targeted extraction property when several objects exist within JSON', () => {
      const obj1 = {};
      obj1[SearchTargetKey] = searchTargetValue;
      obj1[ExtractionTargetKey] = extractionTargetValue;
      const obj2 = {};
      obj2[SearchTargetKey] = `notThe${searchTargetValue}`;
      obj2[ExtractionTargetKey] = `notThe${extractionTargetValue}`;
      const rawJSON = [obj1, obj2];
      const targetJSON = JSON.stringify(rawJSON);

      const options = {
        extractionTargetKey: ExtractionTargetKey,
        searchTargetKey: SearchTargetKey,
        searchTargetValue,
      };

      const result = extractProperty(options, targetJSON);

      expect(result).to.equal(extractionTargetValue);
    });
  });

  describe('error conditions', () => {
    const emptyOptions = {};

    describe('no data in the JSON to extract property from', () => {
      it('should return undefined for no JSON', () => {
        const result = extractProperty(emptyOptions);

        expect(result).to.be.undefined;
      });

      it('should return undefined for empty string', () => {
        const result = extractProperty(emptyOptions, '');

        expect(result).to.be.undefined;
      });

      it('should return undefined for empty JSON array', () => {
        const result = extractProperty(emptyOptions, '[]');

        expect(result).to.be.undefined;
      });

      it('should return undefined for JSON object with no matching search target property key', () => {
        const options = {};
        options[SearchTargetKey] = searchTargetValue;
        const result = extractProperty(options, '[{}]');

        expect(result).to.be.undefined;
      });

      it('should return undefined for JSON object with no matching search target property value', () => {
        const options = {};
        options[SearchTargetKey] = searchTargetValue;
        const extractionObj = {};
        extractionObj[SearchTargetKey] = `notThe${searchTargetValue}`;
        const result = extractProperty(options, JSON.stringify([extractionObj]));

        expect(result).to.be.undefined;
      });

      it('should return undefined for JSON object with no matching extraction target property key', () => {
        const options = {};
        options[SearchTargetKey] = searchTargetValue;
        options[ExtractionTargetKey] = extractionTargetValue;
        const extractionObj = {};
        extractionObj[SearchTargetKey] = searchTargetValue;
        const result = extractProperty(options, JSON.stringify([extractionObj]));

        expect(result).to.be.undefined;
      });

      describe('invalid JSON', () => {
        it('should return undefined', () => {
          const result = extractProperty(emptyOptions, '[{]');

          expect(result).to.be.undefined;
        });
      });
    });
  });
});

