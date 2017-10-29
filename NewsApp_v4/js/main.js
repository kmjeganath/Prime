$(document).ready(function(){ //document.ready will make sure that it will excute the piece of code after the HTML element loads.
setTimeout(function(){ //set time out function for 1 second. (JSON should load first then only we can create slider using the json data)
$('.bxslider').bxSlider({
  minSlides: 3,
  maxSlides: 3,
  slideWidth: 360,
  slideMargin: 1,
  moveSlides: 2,
  pager: false
});
},1000);
$('.slide-title').css('width',$('.display-img').width());



$("#other-news").mouseover(function() {
    // .position() uses position relative to the offset parent, 
    alert("")
    var pos = $(this).position();
    console.log(pos)
    // .outerWidth() takes into account border and padding.
    var width = $(this).outerWidth();
    console.log(width)
    //show the menu directly over the placeholder
    $("#display-popup").css({
        position: "absolute",
        top: pos.top + "px",
        left: (pos.left + width) + "px"
    }).show();
});



	});
