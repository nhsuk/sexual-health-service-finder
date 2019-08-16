#!/usr/bin/env node
/* eslint-disable no-console */
const { once } = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, '../../test/performance/chlamydia-finder.jtl');
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({ input: fileStream });

function calculatePctValue(times, percentile) {
  times.sort((a, b) => a - b);
  const numberOfItems = times.length;
  const indexOfPct = Math.round(numberOfItems * (percentile / 100));
  return times[indexOfPct - 1];
}

(async function processResults() {
  try {
    const averageThreshold = process.env.PERF_TEST_AVG_RESPONSE_THRESHOLD;
    const pctThreshold = process.env.PERF_TEST_PCT_THRESHOLD;
    const pctToCheck = process.env.PERF_TEST_PCT_CHECK;
    const responseCodes = [];
    const times = [];
    let header = true;
    let elapsedIndex;
    let responseIndex;

    rl.on('line', (line) => {
      const items = line.split(',');
      if (header) {
        elapsedIndex = items.findIndex(i => i === 'elapsed');
        responseIndex = items.findIndex(i => i === 'responseCode');

        if (elapsedIndex < 0) {
          throw new Error('No column for \'elapsed\' was found. Unable to calculate times.');
        }

        if (responseIndex < 0) {
          throw new Error('No column for \'responseCode\' was found. Unable to determine if requests were successful.');
        }
        header = false;
      } else {
        times.push(parseInt(items[elapsedIndex], 10));
        responseCodes.push(parseInt(items[responseIndex], 10));
      }
    });

    await once(rl, 'close');

    const pctValue = calculatePctValue(times, pctToCheck);
    if (pctValue > pctThreshold) {
      const msg = `The ${pctToCheck}th percentile time (${pctValue}ms) of responses exceeded threshold (${pctThreshold}ms).`;
      console.error(msg);
      throw new Error(msg);
    } else {
      console.log(`The ${pctToCheck}th percentile time (${pctValue}ms) of responses was within threshold (${pctThreshold}ms).`);
    }

    const totalTime = times.reduce((acc, cur) => acc + cur, 0);
    const averageTime = parseInt(totalTime / times.length, 10);
    if (averageTime > averageThreshold) {
      const msg = `The average duration (${averageTime}ms) of responses exceeded threshold (${averageThreshold}ms).`;
      console.error(msg);
      throw new Error(msg);
    } else {
      console.log(`The average duration (${averageTime}ms) of responses was within threshold (${averageThreshold}ms).`);
    }

    if (responseCodes.some(item => item > 499)) {
      const msg = 'There was at least one failed request.';
      console.error(msg);
      throw new Error(msg);
    } else {
      console.log('No request produced a server error.');
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}());
/* eslint-enable no-console */
