const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');

const constants = require('../app/lib/constants');
const errorCounter = require('../app/lib/prometheus/counters').errorPageViews;
const helmet = require('./helmet');
const locals = require('../app/middleware/locals');
const log = require('../app/lib/logger');
const nunjucks = require('./nunjucks');
const promBundle = require('../app/lib/prometheus/bundle').middleware;
const router = require('./routes');

module.exports = (app, config) => {
  // eslint-disable-next-line no-param-reassign
  app.locals.siteRoot = constants.siteRoot;
  // eslint-disable-next-line no-param-reassign
  app.locals.assetsUrl = constants.assetsUrl;
  // start collecting default metrics
  promBundle.promClient.collectDefaultMetrics();

  nunjucks(app, config);
  helmet(app);

  app.use(locals(config));

  app.use((req, res, next) => {
    log.debug({ req });
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());
  app.use(compression());

  app.use(constants.siteRoot, express.static(`${config.app.root}/public`));

  // metrics needs to be registered before routes wishing to have metrics generated
  // see https://github.com/jochen-schweizer/express-prom-bundle#sample-uusage
  app.use(promBundle);
  app.use(constants.siteRoot, router);
  app.use(constants.siteRoot, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(constants.siteRoot, (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    errorCounter.inc(1);
    log.error({ error: { err, req, res } }, 'Error');
    res.status(statusCode);
    res.render('error', {
      error: app.get('env') === 'development' ? err : {},
      message: err,
      title: 'error',
    });
  });

  app.get('/', (req, res) => {
    res.redirect(constants.siteRoot);
  });
};
