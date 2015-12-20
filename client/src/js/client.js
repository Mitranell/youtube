var timing = require('./timing.js');
var audio = require('./audio.js');
var tool = require('./tool.js');
var dom = require('./dom.js');
var UI = require('./ui.js');
var ui = new UI(dom);

//Complete logic of the cycle of the app goes here
var cycle = {};
cycle.start = function(data) {
    var randomTrack = data[Math.floor(Math.random() * data.length)];
    dom.setTrackInfo(randomTrack.ytTitle, randomTrack.name);
    audio.play(randomTrack.src);
    cycle.loop();
};
cycle.loop = function(){
    requestAnimationFrame(cycle.loop);
    ui.render(audio.getSpectrum(), dom);
    timing.clock(function(h,m,s){
        dom.setClock(h,m,s);
    });
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
