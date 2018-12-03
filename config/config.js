const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    adobeTrackingUrl: process.env.ADOBE_TRACKING_URL,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
    webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
    name: 'sexual-health-service-finder',
    port: process.env.PORT || 3000,
    root: rootPath,
  },
  azureSearch: {
    index: process.env.AS_INDEX || 'organisationlookup-dev',
    key: process.env.AS_API_KEY,
    resultsLimit: process.env.RESULTS_LIMIT || 30,
    serviceName: process.env.AS_SERVICE_NAME || 'nhsuksearchintne',
    version: process.env.AS_VERSION || '2017-11-11',
  },
};
