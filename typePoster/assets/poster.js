var analysis_hidden = true;
console.log ($('.title').css('left'));

$('#button')
    .click(function() {
        if (analysis_hidden) {
            analysis_hidden = false;
            $(this).html("<br>Hide Analysis");
            $(this).animate({}
                left: "574px"
            }, 750);
            $('.title').animate({
                left: "-262px"
            }, 750);
            $('.the_letter').animate({
                left: "190px"
            }, 750);
        } else {
            $(this).animate({
                left: "474px"
            }, 750)
            $('.title').animate({
                left: "-162px"
            }, 750);
            $('.the_letter').animate({
                left: "90px"
            }, 750);
            analysis_hidden = true;
            $(this).html("<Br>Show Analysis");
        }
        
});