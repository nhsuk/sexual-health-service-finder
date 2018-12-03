const nunjucks = require('nunjucks');

const log = require('../app/lib/logger');

function configureNunjucks(app, config) {
  app.set('views', `${config.app.root}/app/views`);
  app.set('view engine', 'nunjucks');
  const nunjucksEnvironment = nunjucks.configure(`${config.app.root}/app/views`, {
    autoescape: true,
    express: app,
    watch: true,
  });
  log.debug({ config: { nunjucksEnvironment } }, 'nunjucks environment configuration');
}

module.exports = configureNunjucks;
