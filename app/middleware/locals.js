const queryMapper = require('../lib/utils/queryMapper');

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;
    res.locals.symptoms = req.query.symptoms;
    res.locals.age = req.query.age;
    res.locals.type = queryMapper.mapServiceType(req.query);
    res.locals.origin = queryMapper.mapServiceChoice(req.query);
    res.locals.location = req.query.location;
    res.locals.locationHeading = queryMapper.getLocationHeading(req.query);
    res.locals.correctLocationParams = res.locals.locationHeading;
    next();
  };
