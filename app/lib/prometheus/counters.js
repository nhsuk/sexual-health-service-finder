const promClient = require('./bundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  emptySearchLocationErrors: new promClient.Counter({ help: 'The number of empty search location errors', name: 'empty_search_location_errors' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
  postcodeNotFoundWarnings: new promClient.Counter({ help: 'The number of postcodes that have not been found', name: 'postcode_not_found_warnings' }),
  validationLocationErrors: new promClient.Counter({ help: 'The number of location validation errors', name: 'validation_location_errors' }),
};
