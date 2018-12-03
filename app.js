const requireEnv = require('require-environment-variables');

const log = require('./app/lib/logger');
const app = require('./server');
const applicationStarts = require('./app/lib/prometheus/counters').applicationStarts;

requireEnv(['AS_API_KEY']);

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});
