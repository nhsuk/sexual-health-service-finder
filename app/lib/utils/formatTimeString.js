const moment = require('moment');

function formatTimeString(timeString) {
  if (timeString === '23:59' || timeString === '00:00') {
    return 'midnight';
  }
  const time = moment();
  const [hours, minutes] = timeString.split(':').map(Number);
  time.minute(minutes);
  time.hour(hours);
  const formatString = time.minutes() === 0 ? 'ha' : 'h:mma';
  return time.format(formatString);
}

module.exports = formatTimeString;
