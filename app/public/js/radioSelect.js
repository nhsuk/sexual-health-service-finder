(function(global) {
  'use strict'
  var $ = global.jQuery;
  var document = global.document;

  $(".multiple-choice--description input").on("click",function() {
    $('input:not(:checked)').parent().removeClass("multiple-choice--selected");
    $('input:checked').parent().addClass("multiple-choice--selected");
  });

})(window);
