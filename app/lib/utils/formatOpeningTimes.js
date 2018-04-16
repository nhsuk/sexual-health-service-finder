const formatTimeString = require('./formatTimeString');

const daysOfWeekOrderedForUi = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTimes(session) {
  return {
    closes: formatTimeString(session.closes),
    opens: formatTimeString(session.opens),
  };
}

function mapDay(sessions) {
  return sessions ? sessions.map(formatTimes) : undefined;
}

function toDayObject(day, times) {
  return {
    day,
    openingTimes: mapDay(times[day.toLowerCase()]),
  };
}
function isOpen(times) {
  return daysOfWeekOrderedForUi.some((day) => {
    const daySessions = times[day.toLowerCase()];
    return daySessions && daySessions.length > 0;
  });
}

function formatOpeningTimes(openingTimes) {
  if (openingTimes && openingTimes.general && isOpen(openingTimes.general)) {
    return daysOfWeekOrderedForUi.map(day => toDayObject(day, openingTimes.general));
  }
  return undefined;
}

module.exports = formatOpeningTimes;

