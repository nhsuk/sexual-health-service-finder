const queryMapper = require('../lib/utils/queryMapper');

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.analytics.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;
    res.locals.RESULTS_LIMIT = config.es.resultsLimit;
    res.locals.siteRoot = req.app.locals.siteRoot;
    res.locals.assetsUrl = req.app.locals.assetsUrl;
    res.locals.symptoms = req.query.symptoms;
    res.locals.age = req.query.age;
    res.locals.choices = req.query.choices;
    res.locals.type = queryMapper.mapServiceType(req.query);
    res.locals.origin = queryMapper.mapServiceChoice(req.query);
    res.locals.location = req.query.location;
    res.locals.locationHeading = queryMapper.getLocationHeading(req.query);
    res.locals.resultsHeading = queryMapper.getResultsHeading(req.query, res.locals.location);
    res.locals.resultsExplanation = queryMapper.getResultsExplanation(req.query);
    res.locals.correctLocationParams = res.locals.locationHeading;
    next();
  };
