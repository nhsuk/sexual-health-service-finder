const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  app: {
    name: 'sexual-health-service-finder',
  },
  env: process.env.NODE_ENV || 'development',
  root: rootPath,
  port: process.env.PORT || 3000,
  headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
};
