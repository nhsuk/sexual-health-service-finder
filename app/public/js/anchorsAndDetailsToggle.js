(function (global) {
  'use strict';
  var $ = global.jQuery;
  var window = global.window;

  if (window.location.hash !== '') {
    var anchor = window.location.hash.substr(1);
    var anchors = ['england', 'scotland', 'wales', 'northern'];
    $.each(anchors, function (index, value) {
      $('#' + value).removeAttr('open');
    });
    $('#' + anchor).attr('open', 'true');

    $('html,body').animate({
      scrollTop: $('#' + anchor).offset().top
    });
  }
})(window);
