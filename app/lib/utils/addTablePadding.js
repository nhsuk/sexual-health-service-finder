function getMaxSessions(openingTimesForWeek) {
  const counts = openingTimesForWeek.map(day => (day.openingTimes ? day.openingTimes.length : 0));
  return Math.max(...counts);
}

function openingTimesMissing(time) {
  return time.openingTimes === undefined;
}

function closed(time) {
  return time.openingTimes.length === 0;
}

function addColumnPadding(openingTimesForWeek) {
  const maxColumns = getMaxSessions(openingTimesForWeek);
  openingTimesForWeek.forEach((time) => {
    /* eslint-disable no-param-reassign */
    if (openingTimesMissing(time)) {
      time.padding = maxColumns;
    } else if (closed(time)) {
      // empty times will be replaced with 'Closed', taking up one cell
      time.padding = maxColumns - 1;
    } else if (time.openingTimes.length < maxColumns) {
      time.padding = maxColumns - time.openingTimes.length;
    }
    /* eslint-enable no-param-reassign */
  });
  return openingTimesForWeek;
}

function addTablePadding(openingTimesForWeek) {
  return openingTimesForWeek ? addColumnPadding(openingTimesForWeek) : undefined;
}

module.exports = addTablePadding;
