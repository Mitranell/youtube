var timing = require('./timing.js');
var audio = require('./audio.js');
var tool = require('./tool.js');
var dom = require('./dom.js');
var UI = require('./ui.js');
var ui = new UI(dom);
var Snow = require('./snow.js');
var snow = new Snow(dom, tool);
var time = 0;
var count = 0;
var trackNumber = 0;

//On window resize
$(window).resize(function() {
    ui.resize();
    snow.resize();
});
ui.resize();
snow.resize();

$(document).keydown(function(e) {
    switch(e.which) {
        case 65: // a
            dom.admin.open();
        break;

        default: return;
    }
    e.preventDefault();
});

//Complete logic of the cycle of the app goes here
var cycle = {};
cycle.start = function(data) {
    playSong(data, trackNumber);
    cycle.loop(data);
};
cycle.loop = function(data){
    requestAnimationFrame(function(){
      cycle.loop(data);
    });
    ui.render(audio.getSpectrum(), dom);
    snow.render(dom);
    timing.clock(function(obj){
        dom.setClock(obj);
    });

    //Counts the amount of times there is no difference between playing time
    count = (audio.deltaTime(time) ?  0 : count + 1);
    checkSongFinished(data);

    //Declare at the end for delay
    time = audio.getTime();
};

//Starting it all
tool.getTracklist(function(data) {
    cycle.start(data);
});

//Play song
playSong = function(data, i) {
  var track = data[i];
  dom.setTrackInfo(track.ytTitle, track.name);
  dom.changeTheme(track.genre.split('.')[0]-1);
  audio.play(track.src);
};

checkSongFinished = function(data) {
  if(!audio.isPlaying(count)) {
    count = 0;
    trackNumber++;
    audio.pause();

    if (trackNumber > data.length - 1) {
      songsFinished();
    } else {
      playSong(data, trackNumber);
    }
  }
};

songsFinished = function(){
  console.log('klaar');
};
