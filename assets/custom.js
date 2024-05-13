$(".tab_variants .danns").on("click", function (event) {
  $('.tab_variants .danns').removeClass('active');
  $(this).addClass('active');
  var type=$(this).data('type');
  $('.show_variants').removeClass('active');
  $('#'+type+'_type').addClass('active');
  $.cookie('inkasstype', type, { expires: 31, path: '/' });

})



if ($('.tab_variants').length > 0) {
  if ( $.cookie('inkasstype') != undefined ) {
    var type=$.cookie('inkasstype');
    if ($('#tab_type_'+type).length > 0) {
      $('.tab_variants .danns').removeClass('active');
      $('#tab_type_'+type).addClass('active');

      $('.show_variants').removeClass('active');
      $('#'+type+'_type').addClass('active');
    }
  }
}