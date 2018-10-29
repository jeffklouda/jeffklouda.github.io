var left;
var right;
var center;
var note_y;
var rest_y;
var bpm;
var time_per_beat;
var px_speed
var lastFrameTimeMs = 0;
var new_note = null;
var game;
var note_width  = 23;
var note_height = 89;
var rest_height = 46;
var vis_offset = 0;
var note_offset = 11;
var rest_offset = 0;
var note_bar;
var snare_buffer;
var metro1_buffer;
var metro2_buffer;
var metronome_on;
var context;
var bufferLoader;
var eight_note_time;
var score = 0;
var total_score = 0;
var game_level;
var max_level = 5;
var can_hit_drum;
var level_presets = [
    ['nrnrnrnrnrnrnrnr', 'nrnrnrnrnrnrnrnr', 'nrnrnrnrnrnrnrnr'],
    ['nnnrnnnrnnnrnnnr', 'nrnrnnnrnrnrnnnn', 'nnnnnrnrnnnnnrnr'],
    ['nnrnnnrnnnrnnnrn', 'nrnnnrnnnrnnnrnn', 'nrrnnrrnnrrnnrrn'],
    ['rnrnrnrnnrnrnnrn', 'rnnrrnnnrrnrrnrn', 'rnrrnnrnrnrrnnrn'],
    ['rnrnrnnnrrnrrrnr', 'rnrnnrrnrrrrrnnr', 'nnnrnnrnrnnrnrnr']
];

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
}

window.addEventListener('load', init, false);

function init() {
    try {
        window.AudioContext =
        window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        return false;
    }
    bufferLoader = new BufferLoader (
        context,
        [
            'assets/audio/snare.mp3',
            'assets/audio/metro1.mp3',
            'assets/audio/metro2.mp3',
        ],
        finishedLoading
    );

    bufferLoader.load();
}

function finishedLoading(bufferList) {
    snare_buffer = bufferList[0];
    metro1_buffer = bufferList[1];
    metro2_buffer = bufferList[2];
}

class Note {
    constructor (type, x) {
        this.type = type;
        this.x = x - vis_offset;
        this.y = note_y;
        this.clicked = false;
        this.html = document.createElement("img");
        this.html.classList.add('note');
        if (type == 'r') {
            this.html.src="assets/images/rest_black.svg";
            this.html.classList.add('rest');
            this.offset = rest_offset;
            this.width = 26;
        }
        else {
            this.html.src="assets/images/note_black.svg";
            this.html.classList.add('eighth');
            this.offset = note_offset;
            this.width = 42;
        }
        this.html.style.left = (this.x - this.offset) + 'px';
        this.html.style.top = (this.y) + 'px';
        this.html.style.display = 'none';
        this.vis_flag = false;
        note_bar.appendChild(this.html);
    }
    update(elapsed_mS) {
        // Move across screen in 8 beats
        this.x = this.x - (elapsed_mS * px_speed);
        if (!this.vis_flag && this.x < right + this.offset) {
            this.vis_flag = true;
            this.html.style.display = 'block';
        } else if (this.x < left + this.offset - this.width) {
            this.html.style.display = 'none';
            return false;
        }
        if (this.vis_flag){
            this.html.style.left = (this.x - this.offset) + 'px';
        }
        return true;
    }
}

function animate_drum() {
    playSound(snare_buffer, 0);
    var stick = $("#drum_stick");
    stick.animate({top: '-33px'}, 0);
    stick.animate({top: '-83px'}, 100);
}

function auto_drum() {
    animate_drum();
    var len = game.activeNotes.length;
    var hit_flag = false; // if a note has been hit
    for (var i = 0; i < len; i++) {
        if (!hit_flag && !game.activeNotes[i].clicked &&
        game.activeNotes[i].type == 'n' &&
        game.activeNotes[i].x > center - note_width &&
        game.activeNotes[i].x < center + note_width) {
            game.activeNotes[i].clicked = true;
            game.activeNotes[i].html.src = "assets/images/note_green.svg";
        }
    }
}

function play_metronome(start_time) {
    var bars;
    if (metronome_on) {
        bars = 4;
    }
    else {
        bars = 2;
    }
    for (var bar = 0; bar < bars; ++bar) {
        time = start_time + bar * 8 * eight_note_time;
        playSound(metro1_buffer, time);
        for (var i = 1; i < 4; ++i) {
            playSound(metro2_buffer, time + i * 2 * eight_note_time);
        }
    }
}

class Game {
    constructor() {
        this.activeNotes = [];
        this.removeNotes = [];
    }
    playAuto(loc, notes, time) {
        setTimeout(function(){
            $("#feedback_text").html("Repeat after me!");
            $("#feedback_text").css("color", "#000");
            can_hit_drum = false;
            }, (loc - center)/ px_speed - 8 * time_per_beat
        );
        for (var i = 0; i < notes.length; i++) {
            var note_type = notes.charAt(i);
            if (note_type == 'n') {
                setTimeout(function(){
                    auto_drum();
                }, (loc - center - note_offset/2)/px_speed);
            }
            this.activeNotes.push(new Note(note_type, loc));
            loc += (time_per_beat * px_speed) / 2;
        }
        play_metronome(time/1000);
    }
    playUser(loc, notes, time) {
        setTimeout(function(){
            $("#feedback_text").html("Your turn!");
            $("#feedback_text").css("color", "#000");
            can_hit_drum = true;
            }, (loc - center)/ px_speed - 8 * time_per_beat
        );
        for (var i = 0; i < notes.length; i++) {
            var note_type = notes.charAt(i);
            if (note_type == 'n') {
                total_score += 1;
            }
            this.activeNotes.push(new Note(note_type, loc));
            loc += (time_per_beat * px_speed) / 2;
        }
        play_metronome(time/1000);
    }
    start(level) {
        //TODO change back to this.level = level
        //TODO metronome and notes are not lined up
        this.level = level-1;
        var loc = center + 8 * time_per_beat * px_speed;
        var time = context.currentTime * 1000;
        for (var i = 0; i < 3; i++) {
            this.playAuto(loc, level_presets[this.level][i], time);
            loc += 16 * time_per_beat * px_speed;
            time += 16 * time_per_beat;
            this.playUser(loc, level_presets[this.level][i], time);
            loc += 16 * time_per_beat * px_speed;
            time += 16 * time_per_beat;
        }
    }
    update(delta) {
        // Update active Notes
        if (!this.activeNotes.length) {
            return false;
        }
        var len = this.activeNotes.length;
        var remove_flag = false;
        for (var i = 0; i < len; i++) {
            if (!this.activeNotes[i].update(delta)) {
                remove_flag = true;
            }
        }
        if (remove_flag) {
            this.activeNotes.shift().html.style.display = 'none';
            i -= 1;
        }
        return true;
    }
    hit_drum() {
        var len = this.activeNotes.length;
        var hit_flag = false; // if a note has been hit
        for (var i = 0; i < len; i++) {
            if (!hit_flag && !this.activeNotes[i].clicked &&
                this.activeNotes[i].x > center - note_width &&
                this.activeNotes[i].x < center + note_width) {
                hit_flag = true;
                if (this.activeNotes[i].x > center - note_width/2 &&
                    this.activeNotes[i].x < center + note_width/2 &&
                    this.activeNotes[i].type == 'n') {
                    $("#feedback_text").html("Perfect!");
                    $("#feedback_text").css("color", "#42ba51")
                    this.activeNotes[i].clicked = true;
                    this.activeNotes[i].html.src = "assets/images/note_green.svg";
                    score += 1;
                } else if (this.activeNotes[i].type == 'n'){
                    this.activeNotes[i].clicked = true;
                    this.activeNotes[i].html.src = "assets/images/note_orange.svg";
                    score += 0.5
                    $("#feedback_text").css("color", "#eda609");
                    if (this.activeNotes[i].x > center) {
                        $("#feedback_text").html("Too early!");
                    } else {
                        $("#feedback_text").html("Too late!");
                    }
                } else {
                    $("#feedback_text").css("color", "#b82125");
                    $("#feedback_text").html("Off Beat!");
                    score -= 0.5;
                }
            }
        }
        return 0;
    }
}

function game_loop(timestamp) {
    if (!lastFrameTimeMs) {
        delta = 0;
    } else {
        delta = timestamp - lastFrameTimeMs;
    }
    lastFrameTimeMs = timestamp;

    if (!game.update(delta)) {
        $("#score").html("Your Score: " + Math.round(score/total_score * 100) + '%')
        $("#feedback_text").html("");
        $("#end_game_popup").show();
        $("#cover").show();
        return;
    }
    requestAnimationFrame(game_loop);
}

function run_game() {
    setTimeout( function() {
        game.start(game_level);
        requestAnimationFrame(game_loop);
    }, time_per_beat);
}



$(document).ready(function() {
    left = Number($("#left_bar").css("left").replace('px', ''));
    left += Number($("#left_bar").css("border-left-width").replace('px', ''));
    right = Number($("#right_bar").css("left").replace('px', ''));
    note_y = Number($("#horiz_bar_3").css("top").replace('px', ''));
    note_y = note_y - note_height + 20;
    rest_y = Number($("#horiz_bar_2").css("top").replace('px', ''));
    center = Number($("#horiz_bar_2").css("left").replace('px', ''));
    center += Number($("#horiz_bar_2").css("width").replace('px', '')) / 2;
    note_bar = document.getElementById("note_bar");
    var path = window.location.pathname;
    var page = path.split("/").pop();
    game_level = Number(page[4]);
    metronome_on = true;
    $("#restart_menu").html("Restart Level " + game_level);
    can_hit_drum = false;
    // BPM changes based on level
    bpm = 75 + 10 * Math.floor((game_level+1)/2);
    console.log(bpm);
    time_per_beat = 60000 / bpm;
    px_speed = ((right - left) * bpm) / 540000;
    eight_note_time = (60 / bpm) / 2;
    game = new Game();

    $(".start").click(function () {
        if ($(this).attr('id') == "metro_off") {
            console.log($(this).attr('id'));
            metronome_on = false;
        } else {
            metronome_on = true;
        }
        $(this).parent().parent().hide();
        $("#start_game_popup").show();
        $("#cover").show();
    });

    $(".popup_close").click(function () {
        $(this).parent().hide();
        $("#start_game_popup").show();
        $("#cover").show();
    });

    $("#start_game_popup").click(function () {
        $(this).hide();
        $("#cover").hide();
        run_game();
    });

    $("#drum").click(function () {
        if (can_hit_drum) {
            animate_drum();
            game.hit_drum();
        }
    });
});
