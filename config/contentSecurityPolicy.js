module.exports = {
  directives: {
    connectSrc: [
      '\'self\'',
      'assets.adobedtm.com',
      '*.demdex.net',
      '*.hotjar.com:*',
      'nhs.funnelback.co.uk',
    ],
    defaultSrc: [
      '\'self\'',
    ],
    fontSrc: [
      '*.hotjar.com',
      '*.nhs.uk',
    ],
    frameSrc: [
      '*.demdex.net',
      '*.hotjar.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.2o7.net',
      '*.everesttech.net',
      '*.hotjar.com',
      '*.nhs.uk',
      '*.omtrdc.net',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
      'assets.adobedtm.com',
      '*.demdex.net',
      '*.hotjar.com',
      '*.nhs.uk',
    ],
    styleSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      '*.nhs.uk',
    ],
  },
};
