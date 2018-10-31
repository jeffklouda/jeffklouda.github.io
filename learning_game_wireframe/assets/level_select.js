$(document).ready(function() {
    var level = 1;
    var max_level = 3;
    var desc;
    localStorage.setItem("level", 1);
    $('.arrow').click (function() {
        if ($(this).attr('id') == 'arrow_left') {
            level--;
        } else {
            level++;
        }
        if (level < 1) {
            level = max_level;
        } else if (level > max_level) {
            level = 1;
        }
        $('#selected_level').html('Level ' + level);
        switch (level) {
            case 1:
                desc = "Quarter Notes";
                break;
            case 2:
                desc = "Quarter Rests";
                break;
            case 3:
                desc = "Eighth Notes";
                break;
            default:
                desc = "ERROR";
                break;
        }
        $('#level_desc').html(desc);
        localStorage.setItem("level", level);
    });
});
