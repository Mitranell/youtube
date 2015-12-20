(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//We can use multiple dancer instances (e.g. one for music, one for voice etc..)
var dancer = new Dancer();
var setSrc = function(url) {
    dancer.load({
        'src': url
    });
};

//Public audio object
var audio = {};
audio.play = function(src) {
    setSrc('../client/tracks/' + src);
    dancer.play();
};
audio.pause = function() {
    dancer.pause();
};
audio.setVolume = function(vol) {
    dancer.setVolume(vol); //Volume from 0 to 1
};
audio.getSpectrum = function() {
    return dancer.getSpectrum();
};
audio.isPlaying = function() {
    return dancer.isPlaying();
};
module.exports = audio;

},{}],2:[function(require,module,exports){
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
    dom.setTitle(randomTrack.ytTitle);
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

},{"./audio.js":1,"./dom.js":3,"./timing.js":4,"./tool.js":5,"./ui.js":6}],3:[function(require,module,exports){
canAnimateKick = true;

//Dom element hooks
var elements = {};
elements.canvasWrapper = $('#canvasWrapper');
elements.theater = $('#theater');
elements.skull = $('#skull');
elements.clock = {};
elements.clock.hours = $('#hours');
elements.clock.minutes = $('#minutes');
elements.clock.seconds = $('#seconds');
elements.trackInfo = $('#trackInfo');

//Public dom object
var dom = {};
dom.canvasWrapperWidth = function(){
    return elements.canvasWrapper.width();
};
dom.canvasWrapperHeight = function(){
    return elements.canvasWrapper.height();
};
dom.kickOptions = function(){
    return {
        frequency: [1, 1],
        threshold: 0.4,
        onKick: function(mag) {
            dom.kick(mag);
        },
        offKick: function(mag) {
            dom.noKick(mag);
        }
    };
};
dom.kick = function(factor) {
    TweenLite.to(elements.theater, 0.1, {
        scale: 1 + factor
    });
};
dom.setClock = function(obj){
    elements.clock.hours.html(obj.h);
    elements.clock.minutes.html(obj.m);
    elements.clock.seconds.html(obj.s);
};
dom.setTitle = function(title){
    var decoded = atob(title); //Decode the base64 title string
    elements.trackInfo.html(decoded);
};

module.exports = dom;

},{}],4:[function(require,module,exports){
// Public timing object
var timing = {};
timing.deadline = '2016-01-01 00:00'; //00:00 is important for timezone
timing.getRemaining = function(){
    function toDD(val) {
        if (val < 10) return '0' + val;
        else return val;
    }
    var obj = {};
    obj.total   =  Date.parse(timing.deadline) - Date.now();
    obj.day     =  toDD(Math.floor(obj.total / (1000 * 60 * 60 * 24)));
    obj.hours   =  toDD(Math.floor((obj.total / (1000 * 60 * 60)) % 24));
    obj.minutes =  toDD(Math.floor((obj.total / 1000 / 60) % 60));
    obj.seconds =  toDD(Math.floor((obj.total / 1000) % 60));
    return obj;
};
timing.getCurMs = function() {
    return Date.now();
};
timing.getRemainingMs = function() {
    return getRemaining().total;
};
var lastSecond = timing.getRemaining().seconds;
timing.clock = function(callback) {
    var rem = timing.getRemaining();
    var curSecond = rem.seconds;
    if(curSecond !== lastSecond){
        var obj = {};
        obj.h = rem.hours;
        obj.m = rem.minutes;
        obj.s = rem.seconds;
        if(callback) callback(obj);
    }
};

module.exports = timing;

},{}],5:[function(require,module,exports){
var tool = {};
tool.getTracklist = function(callback) {
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:1337/getTracklist'
    }).done(function(e) {
        if(callback) callback($.parseJSON(e));
    });
};

tool.get = {};
tool.get.ww = function() {
    return $(window).width();
};
tool.get.wh = function() {
    return $(window).height();
};

module.exports = tool;

},{}],6:[function(require,module,exports){
var color = {};
color.bg = '#1e2230';
color.blue = '#26477d';
color.white = 'rgba(255,255,255,1)';

var ui = function(dom) {
    var c = {};
    c.c = document.getElementById("canvas");
    c.ctx = c.c.getContext("2d");
    this.resize = function() {
        c.c.width = dom.canvasWrapperWidth();
        c.c.height = dom.canvasWrapperHeight();
    };
    this.render = function(spectrumData) {
        var max = 0;
        var x = 0;
        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 6; //Only display the first 1/6th of the spectrum
        spectrum.barWidth = (dom.canvasWrapperWidth() / spectrum.size);

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.size; i++) {
            //TODO We have to choose a value which is best for the TV
            spectrum.barHeight = spectrum.data[i] * 1300;
            c.ctx.fillStyle = color.white;
            c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
            x += spectrum.barWidth * 2; //Makes it display 1/12th of the specturm

            if (spectrum.data[i] > max) max = spectrum.data[i];
        }

        //TODO choose between these two lines (or variants of it):
        //dom.kick((spectrum.data[1] + spectrum.data[2]) / 4);
        dom.kick(max / 2);
    };
};
module.exports = ui;

},{}]},{},[2]);
