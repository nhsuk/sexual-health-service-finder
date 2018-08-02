((global) => {
  const $ = global.jQuery;
  const window = global.window;

  if (window.location.hash !== '') {
    const anchor = window.location.hash.substr(1);
    const anchors = ['scotland', 'wales', 'northern'];
    $.each(anchors, () => {
      $(`#${anchor}`).removeClass('open');
    });
    $(`#${anchor}`).addClass('open');

    $('html,body').animate({
      scrollTop: $(`#${anchor}`).offset().top,
    });
  }
})(window);
