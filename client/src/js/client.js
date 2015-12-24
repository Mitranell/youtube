var timing = require('./timing.js'),
    audio = require('./audio.js'),
    tool = require('./tool.js'),
    dom = require('./dom.js'),
    UI = require('./ui.js'),
    ui = new UI(dom),
    Snow = require('./snow.js'),
    snow = new Snow(dom, tool),
    Playlist = require('./playlist.js'),
    playlist = new Playlist(dom, audio, timing);


//Complete logic of the cycle of the app goes here
var cycle = {};
cycle.start = function(data) {
    playlist.play(data);
    cycle.loop(data);
};
cycle.loop = function(data) {
    requestAnimationFrame(function() {
        cycle.loop(data);
    });
    ui.render(audio.getSpectrum(), dom);
    snow.render(dom);
    timing.clock(function(obj) {
        dom.setClock(obj);
    });
    playlist.progress(data, function(percentage){
        dom.setProgressBar(percentage);
    });
};


//Starting it all
tool.getTracklist(function(data) {
    cycle.start(data);
});


//On window resize
$(window).resize(function() {
    ui.resize();
    snow.resize();
});
ui.resize();
snow.resize();
