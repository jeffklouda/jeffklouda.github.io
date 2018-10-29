$(document).ready(function() {
    var max_level = 5;
    var level = 1;
    var desc;
    var temp = localStorage.getItem("metronome_on");
    if (!temp) {localStorage.setItem("metronome_on", true);}
    $('#selected_level').html('Level ' + level);

    $('.arrow').click (function() {
        if ($(this).attr('id') == 'arr_left') {
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
        $('#game_link').attr('href', 'game' + level + '.html')
    });
});
