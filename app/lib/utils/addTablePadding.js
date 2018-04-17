function getMaxSessions(openingTimesForWeek) {
  const counts = openingTimesForWeek.map(day => (day.openingTimes ? day.openingTimes.length : 0));
  return Math.max(...counts);
}

function addColumnPadding(openingTimesForWeek) {
  const maxColumns = getMaxSessions(openingTimesForWeek);
  openingTimesForWeek.forEach((time) => {
    if (time.openingTimes === undefined) {
      // eslint-disable-next-line no-param-reassign
      time.padding = maxColumns;
    } else if (time.openingTimes.length < maxColumns) {
      // eslint-disable-next-line no-param-reassign
      time.padding = maxColumns - time.openingTimes.length;
    }
  });
  return openingTimesForWeek;
}

function addTablePadding(openingTimesForWeek) {
  return openingTimesForWeek ? addColumnPadding(openingTimesForWeek) : undefined;
}

module.exports = addTablePadding;
