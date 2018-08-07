/* eslint-disable sort-keys */
module.exports = {
  modules: {
    autoRequire: {
      'js/app.js': ['public/js/init'],
    },
  },
  paths: {
    watched: ['scss', 'app/public/js'],
  },
  conventions: {
    ignored: 'scss/app-ie.scss',
  },
  overrides: {
    development: {
      sourceMaps: true,
    },
    production: {
      sourceMaps: false,
      plugins: {
        afterBrunch: [
          // eslint-disable-next-line no-template-curly-in-string
          'sleep 1s && for file in public/js/*.js; do ./node_modules/uglify-es/bin/uglifyjs $file -m -c > ${file}.ugly; mv ${file}.ugly $file; done',
          'sleep 1s && yarn map-replace app/views/layout.nunjucks < assets.json && yarn map-replace app/views/includes/foot.nunjucks < assets.json',
        ],
      },
    },
  },
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app\/public\/js/,
      },
    },
    stylesheets: {
      joinTo: {
        'nhsuk.css': /app.scss/,
        'nhsukie78.css': /app-ie78.scss/,
        'print.css': /app-print.scss/,
      },
    },
  },
  plugins: {
    babel: {
      presets: ['env'],
    },
    sass: {
      options: {
        includePaths: ['scss-live'],
      },
    },
    fingerprint: {
      srcBasePath: 'public/',
      destBasePath: 'public/',
      autoClearOldFiles: true,
    },
  },
};
/* eslint-enable sort-keys */
