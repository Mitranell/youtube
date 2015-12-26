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
audio.play = function(src, ended) {
    audio.pause();
    setSrc('../client/tracks/' + src);
    dancer.play();
    console.log(dancer);

    dancer.source.onended = function() {
        if(ended) ended();
    };
};
audio.getCurrentTime = function(){
    if(dancer.source) return dancer.source.currentTime *1000; //To ms
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
audio.getTime = function() {
    return dancer.getTime();
};
audio.deltaTime = function(previous) {
    return dancer.getTime() - previous > 0;
};
audio.isPlaying = function(count) {
    return count < 10; //Not too low to be sure the audio is playing
};
module.exports = audio;

},{}],2:[function(require,module,exports){
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

},{"./audio.js":1,"./dom.js":3,"./playlist.js":4,"./snow.js":5,"./timing.js":6,"./tool.js":7,"./ui.js":8}],3:[function(require,module,exports){
canAnimateKick = true;

//Dom element hooks
var elements = {};
elements.shirt = $('#shirt');
elements.canvasWrapper = $('#canvasWrapper');
elements.canvas = $('#canvas');
elements.theater = $('#theater');
elements.skull = $('#skull');
elements.logo = $('#logo');
elements.clock = {};
elements.clock.hours = $('#hours');
elements.clock.minutes = $('#minutes');
elements.clock.seconds = $('#seconds');
elements.trackInfo = $('#trackInfo');
elements.progress = $('#progress');

elements.admin = {};
elements.admin.div = $('#admin');
elements.admin.themeDots = elements.admin.div.find('.themeDot');
elements.admin.themeDots.click(function(div){
    var i = $(this).index();
    dom.changeTheme(i);
});
//Public dom object
var dom = {};
dom.canvasWrapperWidth = function(){
    return elements.canvasWrapper.width();
};
dom.canvasWrapperHeight = function(){
    return elements.canvasWrapper.height();
};
dom.kick = function(factor, rotation) {
    TweenLite.to(elements.theater, 0.1, {
        scale: 1 + factor,
        rotation: rotation
    });
};
dom.setClock = function(obj){
    elements.clock.hours.html(obj.h);
    elements.clock.minutes.html(obj.m);
    elements.clock.seconds.html(obj.s);
};
dom.setTrackInfo = function(title,name){
    var decoded = atob(title); //Decode the base64 title string
    elements.trackInfo.html(decoded + ' - ' + name);
};
dom.setProgressBar = function(percentage){
    TweenLite.set(elements.progress, {
        width: percentage + '%'
    });
};

dom.themes = [
    'red',
    'blue',
    'black',
    'yellow'
];
dom.changeTheme = function(i){
    var name = this.themes[i];
    function setTheme(elem){
        $.each(dom.themes, function(i, val){
            elem.removeClass(val);
        });
        elem.addClass(name);
    }
    setTheme(elements.shirt);
    setTheme(elements.canvas);
    setTheme(elements.logo);
};

dom.admin = {};
dom.admin.open = function(){
    elements.admin.div.toggleClass('open');
};

$(document).keydown(function(e) {
    switch (e.which) {
        case 65: // a
            dom.admin.open();
            break;

        default:
            return;
    }
    e.preventDefault();
});

module.exports = dom;

},{}],4:[function(require,module,exports){
var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;
    var ended = false;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        startMs = timing.getCurMs();
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber > data.length - 1) handle.end();
            else handle.play(data);
        });
    };
    this.end = function(){
        ended = true;
        console.log('klaar');
    };
    this.progress = function(data, callback) {
        if(ended) return false;
        var dur = data[trackNumber].duration,
            curTime = audio.getCurrentTime();
        var percentage = (curTime / dur) *100;
        if (callback) callback(percentage);
    };

};
module.exports = playlist;

},{}],5:[function(require,module,exports){
var snow = function(dom, tool) {
    var c = {};
    c.c = document.getElementById("snowCanvas");
    c.ctx = c.c.getContext("2d");
    this.resize = function() {
        c.c.width = tool.get.ww();
        c.c.height = tool.get.wh();
    };
    //snowflake particles
    var mp = 50; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * c.c.width, //x-coordinate
            y: Math.random() * c.c.height, //y-coordinate
            r: Math.random() * 4 + 1, //radius
            d: Math.random() * mp //density
        });
    }
    var angle = 0;
    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;
            if (p.x > c.c.width + 5 || p.x < -5 || p.y > c.c.height) {
                if (i % 3 > 0) //66.67% of the flakes
                {
                    particles[i] = {
                        x: Math.random() * c.c.width,
                        y: -10,
                        r: p.r,
                        d: p.d
                    };
                } else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = {
                            x: -5,
                            y: Math.random() * c.c.height,
                            r: p.r,
                            d: p.d
                        };
                    } else {
                        //Enter from the right
                        particles[i] = {
                            x: c.c.width + 5,
                            y: Math.random() * c.c.height,
                            r: p.r,
                            d: p.d
                        };
                    }
                }
            }
        }
    }
    this.render = function() {
        c.ctx.clearRect(0, 0, c.c.width, c.c.height);

        c.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        c.ctx.beginPath();
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            c.ctx.moveTo(p.x, p.y);
            c.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        c.ctx.fill();
        update();
    };
};
module.exports = snow;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
        var x = 0;
        var max = 0;
        var rotation = 0;
        var range = 10; //Range of bars (max 512) who determine the rotation, bars above range is all full to the right
        var degrees = 5; //Ammount of degrees the skull is rotate left and right

        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 6; //Only display the first 1/6th of the spectrum
        spectrum.barWidth = (dom.canvasWrapperWidth() / spectrum.size);

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.data.length; i++) {
            if(i < spectrum.size){
              spectrum.barHeight = spectrum.data[i] * dom.canvasWrapperHeight();
              c.ctx.fillStyle = color.white;
              c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
              x += spectrum.barWidth * 2; //Makes it display 1/12th of the spectrum
            }

            if (max < spectrum.data[i]) {
              max = spectrum.data[i];
              bar = (i > range) ? range : i;
              rotation = (2 * bar / range  - 1) * degrees;
            }
        }

        dom.kick(max / 2, rotation);
    };
};
module.exports = ui;

},{}]},{},[2]);
