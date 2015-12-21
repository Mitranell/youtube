var timing = require('./timing.js');
var audio = require('./audio.js');
var tool = require('./tool.js');
var dom = require('./dom.js');
var UI = require('./ui.js');
var ui = new UI(dom);
var time = 0;
var count = 0;

//Complete logic of the cycle of the app goes here
var cycle = {};
cycle.start = function(data) {
    var randomTrack = data[Math.floor(Math.random() * data.length)];
    dom.setTrackInfo(randomTrack.ytTitle, randomTrack.name);
    audio.play(randomTrack.src);
    cycle.loop(data);
};
cycle.loop = function(data){
    requestAnimationFrame(function(){
      cycle.loop(data);
    });
    ui.render(audio.getSpectrum(), dom);
    timing.clock(function(h,m,s){
        dom.setClock(h,m,s);
    });

    //Counts the amount of times there is no difference between playing time
    count = (audio.deltaTime(time) ?  0 : count + 1);

    if(!audio.isPlaying(count)) {
      count = 0;
      audio.pause();
      var randomTrack = data[Math.floor(Math.random() * data.length)];
      dom.setTrackInfo(randomTrack.ytTitle, randomTrack.name);
      audio.play(randomTrack.src);
    }

    //Declare at the end for delay
    time = audio.getTime();
};

//Starting it all
tool.getTracklist(function(data) {
    cycle.start(data);
});

//On window resize
$(window).resize(function() {
    ui.resize();
});
ui.resize();
