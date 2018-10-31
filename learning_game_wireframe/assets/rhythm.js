var left;
var right;
var center;
var note_y;
var bpm;
var time_per_beat;
var px_speed
var lastFrameTimeMs = 0;
var new_note = null;
var game;
var note_width = 25;
var note_height = 25;
var note_bar;
var snare_buffer;
var metro1_buffer;
var metro2_buffer;
var context;
var bufferLoader;
var eight_note_time;
var score = 0;
var total_score = 0;
var game_level;

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
        this.x = right - note_width + x;
        this.y = note_y - note_height;
        this.html = document.createElement("DIV");
        this.html.classList.add('note');
        this.html.style.left = this.x + 'px';
        this.html.style.top = this.y + 'px';
        this.html.style.display = 'none';
        this.vis_flag = false;
        note_bar.appendChild(this.html);
    }
    update(elapsed_mS) {
        // Move across screen in 8 beats
        this.x = this.x - (elapsed_mS * px_speed);
        this.html.style.left = (this.x - note_width) + 'px';
        if (!this.vis_flag && this.x < right + 2 * note_width) {
            this.vis_flag = true;
            this.html.style.display = 'block';
        } else if (this.x < left - note_width) {
            this.html.style.display = 'none';
            return false;
        }
        return true;
    }
}
function play_metronome(start_time) {
    var bars;
    if ($(metro_check).is(':checked')) {
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
    async start(level) {
        this.level = level;
        var loc = 4 * time_per_beat * px_speed;
        for (var i = 0; i < 8; i++) {
            total_score += 1;
            this.activeNotes.push(new Note('q', loc));
            loc += time_per_beat * px_speed;
        }
        play_metronome(context.currentTime);
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
            note_bar.removeChild(this.activeNotes.shift().html);
        }
        return true;
    }
    hit_drum() {
        var len = this.activeNotes.length;
        for (var i = 0; i < len; i++) {
            if (this.activeNotes[i].x > center - note_width &&
                this.activeNotes[i].x < center + 1.5*note_width) {
                this.activeNotes[i].html.style.backgroundColor = 'yellowgreen';
                score += 1;
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
            $("#score").html("Your Score: " + score + "/" + total_score)
            $("#end_game_popup").show();
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
    note_y = Number($("#horiz_bar").css("top").replace('px', ''));
    center = Number($("#horiz_bar").css("left").replace('px', ''));
    center += Number($("#horiz_bar").css("width").replace('px', '')) / 2;
    note_bar = document.getElementById("note_bar");
    game_level = localStorage.getItem("level");
    // Changes based on level
    bpm = 120;
    time_per_beat = 60000 / bpm;
    px_speed = ((right - left) * bpm) / 540000;
    eight_note_time = (60 / bpm) / 2;
    game = new Game();

    $(".popup_close").click(function () {
        $(this).parent().hide();
        $("#start_game_popup").show();
    });

    $("#start_game_popup").click(function () {
        $(this).hide();
        run_game();
    })

    $("#metro_menu").click(function () {
        var checkBox = $("#metro_check");
        checkBox.prop("checked", !checkBox.prop("checked"));
    });

    $("#drum").click(function () {
        playSound(snare_buffer, 0);
        game.hit_drum();
    });

    $(document).keypress(function(e) {
        if (e.which == 32) {
            $("#drum").click();
        }
    });
    console.log(center);
});
