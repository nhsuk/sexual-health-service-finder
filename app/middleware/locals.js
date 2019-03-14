const digitalData = require('../lib/displayUtils/digitalData');
const queryMapper = require('../lib/utils/queryMapper');
const trim = require('../lib/utils/utils').trim;

module.exports = config => (req, res, next) => {
  res.locals.ADOBE_TRACKING_URL = config.analytics.adobeTrackingUrl;
  res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
  res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;

  res.locals.assetsUrl = req.app.locals.assetsUrl;
  res.locals.siteRoot = req.app.locals.siteRoot;
  res.locals.digitalData = digitalData(req);

  res.locals.symptoms = req.query.symptoms;
  res.locals.age = req.query.age;
  res.locals.choices = req.query.choices;
  res.locals.type = queryMapper.mapServiceType(req.query);
  res.locals.origin = queryMapper.mapServiceChoice(req.query);
  res.locals.location = trim(req.query.location);
  const locationInfo = queryMapper.getLocationInfo(req.query);
  if (locationInfo.analyticsPageTitle) {
    res.locals.analyticsPageTitle = locationInfo.analyticsPageTitle;
  }
  res.locals.correctLocationParams = locationInfo.correctLocationParams;
  res.locals.locationHeading = locationInfo.locationHeading;
  const resultsInfo = queryMapper.getResultsInfo(req.query, res.locals.location);
  if (resultsInfo.analyticsPageTitle) {
    res.locals.analyticsPageTitle = resultsInfo.analyticsPageTitle;
  }
  res.locals.resultsHeading = resultsInfo.resultsHeading;
  res.locals.resultsInternalUrl = resultsInfo.resultsInternalUrl;
  res.locals.resultsExplanation = resultsInfo.resultsExplanation;
  res.locals.resultsOnwardsJourneyPartial = resultsInfo.resultsOnwardsJourneyPartial;
  res.locals.correctResultsParams = resultsInfo.correctResultsParams;
  next();
};
