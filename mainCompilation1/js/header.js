// When the user scrolls down 80px from the top of the document, resize the navbar image and paddings
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("logo-img-main").style.maxWidth = "62px"
        document.getElementById("cart-div").style.paddingTop = "0rem"
        document.getElementById("main-nav").style.paddingTop = "0.5rem"
        document.getElementById("header-id").style.maxHeight = "62px"
        document.getElementById("logo-img-main").src="img/logoImg/grillvoyageSmall.png";

    } else {
        document.getElementById("logo-img-main").style.maxWidth = "200px"
        document.getElementById("cart-div").style.paddingTop = "4rem"
        document.getElementById("main-nav").style.paddingTop = "4rem"
        document.getElementById("header-id").style.maxHeight = "300px"
        document.getElementById("logo-img-main").src="img/logoImg/grillvoyageLarge.png";
        }
}