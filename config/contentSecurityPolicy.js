module.exports = {
  directives: {
    childSrc: [
      '*.hotjar.com',
    ],
    connectSrc: [
      '\'self\'',
      '*.hotjar.com:*',
    ],
    defaultSrc: [
      '\'self\'',
    ],
    fontSrc: [
      '*.nhs.uk',
      '*.hotjar.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
      '*.nhs.uk',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
    ],
    styleSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      '*.nhs.uk',
    ],
  },
};
