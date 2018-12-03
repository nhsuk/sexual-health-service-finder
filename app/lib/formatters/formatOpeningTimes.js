const VError = require('verror').VError;

const formatTimeString = require('./formatTimeString');
const log = require('../logger');

const daysOfWeekOrderedForUi = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTimes(time) {
  return formatTimeString(time);
}

function mapOpeningTimes(day) {
  const [opens, closes] = day.Times.split('-').map(formatTimes);
  return { closes, opens };
}

function formatOpeningTimes(openingTimesString) {
  if (!openingTimesString) { return undefined; }

  let json;
  try {
    json = JSON.parse(openingTimesString);
    if (!json) { return undefined; }
  } catch (err) {
    const msg = 'Error parsing JSON string during opening times mapping.';
    const error = new VError(err.stack, msg);
    log.error({ err: error }, msg);

    return undefined;
  }

  return daysOfWeekOrderedForUi.map((dayOfWeek) => {
    const dayOpeningTimes = json
      .filter(openingTime => openingTime.WeekDay === dayOfWeek)
      .map(mapOpeningTimes);

    return {
      day: dayOfWeek,
      openingTimes: dayOpeningTimes,
    };
  });
}

module.exports = formatOpeningTimes;
