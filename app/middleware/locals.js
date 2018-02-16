module.exports = config =>
  (req, res, next) => {
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;
    next();
  };
