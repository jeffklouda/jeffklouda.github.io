var analysis_hidden = true;

$('.analysis_button')
    .click(function() {
        if (analysis_hidden) {
            analysis_hidden = false;
            $(this).html("Hide Analysis");
            $('.title').animate({
                left: "-262px"
            }, 750);
            $('.the_letter').animate({
                left: "190px"
            }, 750);
        } else {
            $('.title').animate({
                left: "-162px"
            }, 750);
            $('.the_letter').animate({
                left: "90px"
            }, 750);
            analysis_hidden = true;
            $(this).html("Show Analysis");
        }
        
});