(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var test = require('./test.js');
var elements = require('./elements.js');

audio = new Audio();
dancer = new Dancer();

setSrc = function(url) {
    dancer.load({
        'src': url
    });
};
startPlaylist = function(trackListArray) {
    var src = trackListArray[Math.floor(Math.random() * trackListArray.length)];
    setSrc(test.dir + src);
    play();
};
play = function() {
    dancer.play();
};
pause = function() {
    dancer.pause();
};
setVolume = function(vol) {
    dancer.setVolume(vol); //Volume from 0 to 1
};
getSpectrum = function() {
    return dancer.getSpectrum();
};
getWaveform = function() {
    return dancer.getWaveform();
};
kick = dancer.createKick({
    frequency: [1, 3],
    threshold: 0.4,
    onKick: function(mag) {
        elements.kick();
    },
    offKick: function(mag) {
        elements.noKick();
    }
});
kick.on();

module.exports = {
  getSpectrum : getSpectrum,
  startPlaylist : startPlaylist
};

},{"./elements.js":3,"./test.js":4}],2:[function(require,module,exports){
var timing = require('./timing.js');
var test = require('./test.js');
var ui = require('./ui.js');
var audio = require('./audio.js');

    $(window).resize(function() {
        ui.resize();
    });

    var w = {};
    w.w = function() {
        return $(window).width();
    };
    w.h = function() {
        return $(window).height();
    };

    var tool = {};
    tool.readFile = function(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    var content = rawFile.responseText;
                    console.log(content);
                    if (callback) callback(content);
                }
            }
        };
        rawFile.send(null);
    };

    //Starting it all
    tool.readFile(test.dir + 'tracklist.txt', function(data) {
        data = data.split(',');
        console.log(data);
        audio.startPlaylist(data);
        ui.render();
    });
    ui.resize();

},{"./audio.js":1,"./test.js":4,"./timing.js":5,"./ui.js":6}],3:[function(require,module,exports){
canvasWrapper = $('#canvasWrapper');
canvasWrapperWidth = function(){
    return canvasWrapper.width();
};
canvasWrapperHeight = function(){
    return canvasWrapper.height();
};
this.theater = $('#theater');
this.skull = $('#skull');

canAnimateKick = true;
kick = function() {
    console.log('kick');
    canAnimateKick = false;
    TweenLite.to(theater, 0.1, {
        scale: 1.05,
        onComplete: function() {
            canAnimateKick = true;
        }
    });
};
noKick = function() {
    if (canAnimateKick) {

        TweenLite.to(theater, 0.1, {
            scale: 1
        });
    }
};

module.exports = {
  canvasWrapperWidth : canvasWrapperWidth,
  canvasWrapperHeight : canvasWrapperHeight,
  theater : theater,
  skull : skull,
  kick : kick,
  noKick : noKick
};

},{}],4:[function(require,module,exports){
this.track = '1.Hardstyle637Mark van der Pijl.mp3';
this.dir = '../client/tracks/';
this.src = this.dir + this.track;

},{}],5:[function(require,module,exports){
deadline = '2016-01-01';
getRemaining = function() {
    var t = Date.parse(deadline) - Date.now();
    var s = Math.floor((t / 1000) % 60);
    var m = Math.floor((t / 1000 / 60) % 60);
    var h = Math.floor((t / (1000 * 60 * 60)) % 24);
    var d = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': d,
        'hours': h,
        'minutes': m,
        'seconds': s
    };
};
getCurMs = function() {
    return Date.now();
};
getRemainingMs = function() {
    return getRemaining().total;
};
console.log('CurMs:' + getCurMs());
console.log('Till deadline:');
var rem = getRemaining();
console.log('Days:' + rem.days);
console.log('hours:' + rem.hours);
console.log('minutes:' + rem.minutes);
console.log('seconds:' + rem.seconds);

module.exports = {
  getCurMs : getCurMs
};

},{}],6:[function(require,module,exports){
var audio = require('./audio.js');
var timing = require('./timing.js');
var elements = require('./elements.js');

var color = {};
color.bg = '#1e2230';
color.blue = '#26477d';
color.white = 'rgba(255,255,255,1)';

c = document.getElementById("canvas");
ctx = c.getContext("2d");
resize = function() {
    c.width = elements.canvasWrapperWidth();
    c.height = elements.canvasWrapperHeight();
};
render = function() {
    requestAnimationFrame(render);
    var curMs = timing.getCurMs();
    draw();
};
draw = function() {
    var spectrum = {};
    spectrum.data = audio.getSpectrum();
    spectrum.size = spectrum.data.length / 6;
    spectrum.barWidth = (elements.canvasWrapperWidth() / spectrum.size);
    x = 0;

    ctx.clearRect(0, 0, elements.canvasWrapperWidth(), elements.canvasWrapperHeight());
    for (var i = 0; i < spectrum.size; i++) {
        spectrum.barHeight = spectrum.data[i] * 1500;
        ctx.fillStyle = color.white;
        ctx.fillRect(x, elements.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
        x += spectrum.barWidth*2;
    }
};

module.exports = {
  render : render,
  resize : resize
};

},{"./audio.js":1,"./elements.js":3,"./timing.js":5}]},{},[2]);
