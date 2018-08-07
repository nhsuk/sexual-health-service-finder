((global) => {
  const $ = global.jQuery;

  $('.multiple-choice--description input').on('click', () => {
    $('input:not(:checked)').parent().removeClass('multiple-choice--selected');
    $('input:checked').parent().addClass('multiple-choice--selected');
  });
})(window);
