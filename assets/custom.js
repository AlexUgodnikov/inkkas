jQuery(function($) {
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
});

jQuery(function($) {
  jQuery(".product-form__input_dann label").on("click", function (event) {

    var var_id=$(this).data('variantid');
    var title=$(this).data('title');
    var titleshort=$(this).data('titleshort');
    $('.product-form form input[name="id"]').val(var_id);
    history.pushState({}, null, '?variant='+var_id);
    console.log(titleshort+'==titleshort');
    $('.main_prod_'+titleshort+'').click();
    $('.product_'+titleshort+'').click();
    // $('[data-inputshort="'+titleshort+'"]').attr('checked', true);


    $('variant-radios').change();


    if ($(this).hasClass('available_true')) {
      $('.product-form__submit').html('Add to cart');
      $('.product-form__submit').prop("disabled", false);
    }
    if ($(this).hasClass('available_false')) {
      $('.product-form__submit').html('Sold out');
      $('.product-form__submit').prop("disabled", true);
    }

  })
})