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
    playlist.setNavigation(data);
    playlist.startAnimation(data);
    cycle.loop(data);
};
cycle.loop = function(data) {
    requestAnimationFrame(function() {
        cycle.loop(data);
    });
    timing.clock(function(obj) {
        if (obj.t > 10000) dom.setClock(obj);
        else dom.hideTimer();
    });
    if (!audio.paused) {
        ui.render(audio.getSpectrum(), dom);
        snow.render(dom);
        playlist.progress(data, function(percentage){
            dom.setProgressBar(percentage);
        });
    }
};


//Starting it all
tool.getTracklist(function(data) {
    $(document).keydown(function(e) {
        switch (e.which) {
            case 32: // spacebar
                playlist.playCurrent(data);
                break;
            case 37: // left arrow
                playlist.playPrevious(data);
                break;
            case 39: // right arrow
                playlist.playNext(data);
                break;

            default:
                return;
        }
        e.preventDefault();
    });

    cycle.start(data);
});


//On window resize
$(window).resize(function() {
    ui.resize();
    snow.resize();
});
ui.resize();
snow.resize();
