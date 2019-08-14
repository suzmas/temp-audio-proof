

$(document).ready(function($) {
  function sizeGridItems() {
    const elementHeights = $('.content').map(function() {
      return $(this).outerHeight();
    }).get();
    const maxHeight = Math.max.apply(null, elementHeights);
    
    // set cards to height of tallest content
    $('.content-ctr').height(maxHeight);
  }
  
  $('.expand-btn').click(function() {
    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).closest('.card').removeClass('expanded');
      $(this).closest('.card-row').removeClass('child-expanded');
    } else {
      $(this).addClass('expanded');
      $(this).closest('.card').addClass('expanded');
      $(this).closest('.card-row').addClass('child-expanded');
    }
  });
  $(window).resize(sizeGridItems);

  sizeGridItems();
});