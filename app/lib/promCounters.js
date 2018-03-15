const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  emptySearchLocationErrors: new promClient.Counter({ help: 'The number of empty search location errors', name: 'empty_search_location_errors' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
  outOfEnglandLocationWarnings: new promClient.Counter({ help: 'The number of out of England location warnings', name: 'out_of_england_location_warnings' }),
  validationLocationErrors: new promClient.Counter({ help: 'The number of location validation errors', name: 'validation_location_errors' }),
};
