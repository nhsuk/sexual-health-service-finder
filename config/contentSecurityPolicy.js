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
      '*.cookiebot.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
      '*.cookiebot.com',
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
      '*.cookiebot.com',
    ],
    styleSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      '*.cookiebot.com',
      '*.nhs.uk',
    ],
  },
};
