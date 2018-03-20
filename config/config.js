/* eslint-disable sort-keys */
const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'sexual-health-service-finder',
  },
  root: rootPath,
  port: process.env.PORT || 3000,
  headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
  env: process.env.NODE_ENV || 'development',
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
  },
  resultsLimit: process.env.RESULTS_LIMIT || 30,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
};
/* eslint-enable sort-keys */
