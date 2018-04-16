const log = require('./app/lib/logger');
const app = require('./server');
const applicationStarts = require('./app/lib/prometheus/counters').applicationStarts;

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});
