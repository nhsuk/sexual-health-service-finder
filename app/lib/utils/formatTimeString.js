const moment = require('moment');

function formatTimeString(timeString) {
  if (timeString === '23:59' || timeString === '00:00') {
    return 'midnight';
  }
  const time = moment(timeString, 'HH:mm');
  const formatString = time.minutes() === 0 ? 'ha' : 'h:mma';
  return time.format(formatString);
}

module.exports = formatTimeString;
