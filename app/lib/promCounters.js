const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ name: 'app_starts', help: 'The number of times the application has been started' }),
  errorPageViews: new promClient.Counter({ name: 'error_page_views', help: 'The number of error page views' }),
  emptySearchLocationErrors: new promClient.Counter({ name: 'empty_search_location_errors', help: 'The number of empty search location errors' }),
  validationLocationErrors: new promClient.Counter({ name: 'validation_location_errors', help: 'The number of location validation errors' }),
  outOfEnglandLocationWarnings: new promClient.Counter({ name: 'out_of_england_location_warnings', help: 'The number of out of England location warnings' }),
};
