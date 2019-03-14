const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    adobeTrackingUrl: process.env.ADOBE_TRACKING_URL,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    name: 'sexual-health-service-finder',
    port: process.env.PORT || 3000,
    root: rootPath,
  },
  search: {
    apiKey: process.env.SEARCH_API_KEY,
    host: process.env.SEARCH_API_HOST || 'api.nhs.uk',
    maxNumberOfResults: 30,
    version: process.env.SEARCH_API_VERSION || '1',
  },
};
