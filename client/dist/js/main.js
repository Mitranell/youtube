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
    dancer.pause();
    setSrc('../client/tracks/' + src);
    dancer.play();

    dancer.source.onended = function() {
        if(ended) ended();
    };
};
audio.pause = function() {
    dancer.pause();
};
audio.unpause = function() {
    dancer.play();
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
audio.isPlaying = function(count) {
    return dancer.isPlaying();
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
    playlist.setNavigation(data);
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

},{"./audio.js":1,"./dom.js":3,"./playlist.js":5,"./snow.js":6,"./timing.js":7,"./tool.js":8,"./ui.js":9}],3:[function(require,module,exports){
var elements = require('./elements.js');

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
dom.kick = function(factor, rotation, speed, perspective) {
    TweenLite.set(elements.theater, {
        transformPerspective : perspective
      });
    TweenLite.to(elements.theater, speed, {
        scale: 1 + factor
    });
    TweenLite.to(elements.theater, speed, {
        rotationX: rotation,
        transformOrigin: "50% 75%" //Location: upper lip = where spine is attached to head
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
dom.getRange = function() {
    return elements.range.slider("value");
};
dom.getDegrees = function() {
    return elements.degrees.slider("value");
};
dom.getSpeed = function() {
    return elements.speed.slider("value");
};
dom.getPerspective = function() {
    return elements.perspective.slider("value");
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
    setTheme(elements.progress);
};

dom.admin = {};
dom.admin.open = function(){
    elements.admin.div.toggleClass('open');
};
dom.admin.previous = $("#previous");
dom.admin.play = $("#play");
dom.admin.next = $("#next");

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

},{"./elements.js":4}],4:[function(require,module,exports){
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
elements.range = $("#range");
elements.range.value = $("#rangeValue");
elements.degrees = $("#degrees");
elements.degrees.value = $("#degreesValue");
elements.speed = $("#speed");
elements.speed.value = $("#speedValue");
elements.perspective = $("#perspective");
elements.perspective.value = $("#perspectiveValue");

//Range of bars (max 512) who determine the rotation, bars above range is all full to the right
elements.range.slider({
    range: 'min',
    min: 1,
    max: 512,
    value: 10,
    slide: function(event, ui) {
        elements.range.value.val(ui.value);
    }
});
elements.range.value.val(elements.range.slider("value")); //Initialize

//Ammount of degrees the skull rotates
elements.degrees.slider({
    range: 'min',
    min: 1,
    max: 360,
    value: 5,
    slide: function(event, ui) {
        elements.degrees.value.val(ui.value);
    }
});
elements.degrees.value.val(elements.degrees.slider("value")); //Initialize

elements.speed.slider({
    range: 'min',
    min: 0.01,
    max: 1,
    value: 0.2,
    step: 0.01,
    slide: function(event, ui) {
        elements.speed.value.val(ui.value);
    }
});
elements.speed.value.val(elements.speed.slider("value")); //Initialize

elements.perspective.slider({
    range: 'min',
    min: 1,
    max: 1000,
    value: 500,
    slide: function(event, ui) {
        elements.perspective.value.val(ui.value);
    }
});
elements.perspective.value.val(elements.perspective.slider("value")); //Initialize

//Change slider when input is changed
elements.range.value.change(function(){
    elements.range.slider("value", $(this).val());
});
//Change slider when input is changed
elements.degrees.value.change(function(){
    elements.degrees.slider("value", $(this).val());
});
//Change slider when input is changed
elements.speed.value.change(function(){
    elements.speed.slider("value", $(this).val());
});
//Change slider when input is changed
elements.perspective.value.change(function(){
    elements.perspective.slider("value", $(this).val());
});

module.exports = elements;

},{}],5:[function(require,module,exports){
var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;

    var handle = this;
    this.play = function(data) {
        var track = data[trackNumber];
        dom.setTrackInfo(track.ytTitle, track.name);
        dom.changeTheme(track.genre.split('.')[0] - 1);
        audio.play(track.src, function() {
            trackNumber++;
            if (trackNumber < data.length) handle.play(data);
            else console.log('klaar');
        });
    };
    this.progress = function(data, callback) {
        var dur = data[trackNumber].duration,
            cur = audio.getTime() * 1000, //Seconds to miliseconds
            percentage = (cur / dur) * 100;
        if (callback) callback(percentage);
    };
    this.setNavigation = function(data) {
        dom.admin.previous.click(function(){
            if(trackNumber > 0) {
                trackNumber--;
                handle.play(data);
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
        dom.admin.play.click(function(){
            if (audio.isPlaying()) {
                audio.pause();
                dom.admin.play.removeClass("fa-pause");
                dom.admin.play.addClass("fa-play");
            } else {
                audio.unpause();
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
        dom.admin.next.click(function(){
            if (data.length > trackNumber + 1) {
                trackNumber++;
                handle.play(data);
                dom.admin.play.removeClass("fa-play");
                dom.admin.play.addClass("fa-pause");
            }
        });
    };
};
module.exports = playlist;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
        var range = dom.getRange();
        var degrees = dom.getDegrees();
        var speed = dom.getSpeed();
        var perspective = dom.getPerspective();

        var spectrum = {};
        spectrum.data = spectrumData;
        spectrum.size = spectrum.data.length / 8; //Only display the first 1/8th of the spectrum
        spectrum.barWidth = dom.canvasWrapperWidth() / spectrum.size;
        x += spectrum.barWidth / 2; //center the spectrum

        //Draw frequencyBars to canvas
        c.ctx.clearRect(0, 0, dom.canvasWrapperWidth(), dom.canvasWrapperHeight());
        for (var i = 0; i < spectrum.data.length; i++) {
            if(i < spectrum.size){
              spectrum.barHeight = spectrum.data[i] * dom.canvasWrapperHeight();
              c.ctx.fillStyle = color.white;
              c.ctx.fillRect(x, dom.canvasWrapperHeight() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
              x += spectrum.barWidth * 2; //Makes it display 1/16th of the spectrum (32 bars)
            }

            if (max < spectrum.data[i]) {
              max = spectrum.data[i];
              bar = (i > range) ? range : i;
              rotation = (2 * bar / range  - 1) * degrees;
            }
        }

        dom.kick(max / 2, rotation, speed, perspective);
    };
};
module.exports = ui;

},{}]},{},[2]);
