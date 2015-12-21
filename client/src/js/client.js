var timing = require('./timing.js');
var audio = require('./audio.js');
var tool = require('./tool.js');
var dom = require('./dom.js');
var UI = require('./ui.js');
var ui = new UI(dom);
var Snow = require('./snow.js');
var snow = new Snow(dom, tool);

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
    var randomTrack = data[Math.floor(Math.random() * data.length)];
    dom.setTrackInfo(randomTrack.ytTitle, randomTrack.name);
    audio.play(randomTrack.src);
    dom.changeTheme(randomTrack.genre.split('.')[0]-1);
    cycle.loop();
};
cycle.loop = function(){
    requestAnimationFrame(cycle.loop);
    ui.render(audio.getSpectrum(), dom);
    snow.render(dom);
    timing.clock(function(obj){
        dom.setClock(obj);
    });
};

//Starting it all
tool.getTracklist(function(data) {
    cycle.start(data);
});
