const nunjucks = require('nunjucks');

const log = require('../app/lib/logger');

function configureNunjucks(app, config) {
  app.set('views', `${config.app.root}/app/views`);
  app.set('view engine', 'nunjucks');
  const appViews = [
    `${config.app.root}/app/views`,
    'node_modules/nhsuk-frontend/packages/components',
  ];
  const nunjucksEnvironment = nunjucks.configure(appViews, {
    autoescape: true,
    express: app,
    watch: true,
  });
  log.debug({ config: { nunjucksEnvironment } }, 'nunjucks environment configuration');
}

module.exports = configureNunjucks;
