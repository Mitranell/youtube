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
audio.paused = false;
audio.play = function(src, ended) {
    setSrc('../client/tracks/' + src);
    audio.unpause();

    dancer.source.onended = function() {
        if(ended) ended();
    };
};
audio.getCurrentTime = function(){
    if(dancer.source) return dancer.source.currentTime *1000; //To ms
};
audio.pause = function() {
    dancer.pause();
    audio.paused = true;
};
audio.unpause = function() {
    dancer.play();
    audio.paused = false;
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

},{"./audio.js":1,"./dom.js":3,"./playlist.js":5,"./snow.js":6,"./timing.js":7,"./tool.js":8,"./ui.js":9}],3:[function(require,module,exports){
var elements = require('./elements.js');

elements.final.click(function() {
    dom.setFinalCountdown();
});

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
    elements.clock.seconds.html(obj.s - 1);
};
dom.setTrackInfo = function(number, title, name){
    var decoded = atob(title); //Decode the base64 title string
    elements.trackInfo.find('.table-cell').html(number + '. ' + decoded + ' - ' + name);
};
dom.setProgressBar = function(percentage){
    TweenLite.set(elements.progress, {
        width: percentage + '%'
    });
};
dom.setFinalCountdown = function(){ //Needs a lot of adjustment
    TweenLite.to([elements.canvasWrapper, elements.canvas], 1, {
        top: '-200%'
    });
    TweenLite.to(elements.trackInfo, 1, {
        opacity: 0
    });
    TweenLite.to(elements.bar, 1, {
        height: '100%'
    });
    TweenLite.to(elements.clock.div, 1, {
        width: '100%',
        right: 0,
        fontSize: '20rem'
    });
    TweenLite.to(elements.progress, 0.5, {
        opacity: 0
    });
    dom.changeTheme(1);
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
dom.startAnimation = function(callback) {
    elements.leftEye.css('opacity', 0);
    elements.rightEye.css('opacity', 0);
    TweenLite.to([elements.detailing, elements.teeth, elements.logo], 2, {
        opacity: 0
    });
    TweenLite.to(elements.theater, 2, {
        scale: 8,
        onComplete: callback
    });
};
dom.showNewTrack = function(genre, callback){
    elements.clock.div.hide();
    elements.progress.hide();
    TweenLite.set(elements.bar, {
        zIndex: 100,
        height: '100%'
    });

    elements.trackInfo.addClass('blurred');
    TweenLite.to(elements.trackInfo, 1, {
        width: '100%',
        left: 0,
        color: 'black',
        //fontSize: '20rem'
        onComplete: function(){
            elements.trackInfo.removeClass('blurred');
            TweenLite.to(elements.trackInfo, 0.5, {
                opacity: 0,
                delay: 2
            });
        }
    });
    TweenLite.to(elements.trackInfo, 5, {
        //Blur...
        onComplete: callback
    });
};
dom.reverseAnimation = function(callback) {
    elements.clock.div.show();
    elements.progress.show();
    TweenLite.to(elements.trackInfo, 2, {
        color: '#ffffff',
        width: 'auto',
        left: 25
    });
    TweenLite.to(elements.bar, 2, {
        height: 100,
        onComplete: function() {
                        // elements.bar.css('z-index', 0);
                        TweenLite.set(elements.bar, {
                            zIndex: 0
                        });
                        TweenLite.to(elements.trackInfo, 2, {
                            opacity: 1
                        });
                    }
    });
    TweenLite.to([elements.detailing, elements.teeth, elements.logo], 2, {
        opacity: 1,
        onComplete: function() {
                        // elements.leftEye.css('opacity', 1);
                        // elements.rightEye.css('opacity', 1);

                        TweenLite.set(elements.leftEye, {
                            opacity: 1
                        });
                        TweenLite.set(elements.rightEye, {
                            opacity: 1
                        });
                    }
    });
    TweenLite.to(elements.theater, 2, {
        scale: 1,
        onComplete: callback
    });
};
dom.hideTimer = function(){
    TweenLite.to(elements.clock.div, 0.5, {
        opacity: 0
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
    setTheme(elements.progress);
};

dom.startVideo = function(){
    TweenLite.to(elements.main, 0.5, {
        opacity: 0
    });
    elements.videoElem.play();
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
        case 49: // 1
            dom.changeTheme(0);
            break;
        case 50: // 2
            dom.changeTheme(1);
            break;
        case 51: // 3
            dom.changeTheme(2);
            break;
        case 52: // 4
            dom.changeTheme(3);
            break;
        case 53: // 4
            dom.startVideo();
            break;
        case 70: // f
            dom.setFinalCountdown();
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

elements.main = $('main');

elements.shirt = $('#shirt');
elements.canvasWrapper = $('#canvasWrapper');
elements.canvas = $('#canvas');
elements.theater = $('#theater');
elements.skull = $('#skull');
elements.detailing = $('#detailing');
elements.teeth = $('#teeth');
elements.leftEye = $('#leftEye');
elements.rightEye = $('#rightEye');
elements.logo = $('#logo');

elements.bar = $('#bar');
elements.video = $('#video');
elements.videoElem = document.getElementById("fireworks");


elements.clock = {};
elements.clock.div = $('#clock');
elements.clock.hours = $('#hours');
elements.clock.minutes = $('#minutes');
elements.clock.seconds = $('#seconds');
elements.trackInfo = $('#trackInfo');
elements.progress = $('#progress');
elements.range = $('#range');
elements.range.value = $('#rangeValue');
elements.degrees = $('#degrees');
elements.degrees.value = $('#degreesValue');
elements.speed = $('#speed');
elements.speed.value = $('#speedValue');
elements.perspective = $('#perspective');
elements.perspective.value = $('#perspectiveValue');
elements.final = $('#final');

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
elements.range.value.val(elements.range.slider('value')); //Initialize

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
elements.degrees.value.val(elements.degrees.slider('value')); //Initialize

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
elements.speed.value.val(elements.speed.slider('value')); //Initialize

elements.perspective.slider({
    range: 'min',
    min: 1,
    max: 1000,
    value: 500,
    slide: function(event, ui) {
        elements.perspective.value.val(ui.value);
    }
});
elements.perspective.value.val(elements.perspective.slider('value')); //Initialize

//Change slider when input is changed
elements.range.value.change(function(){
    elements.range.slider('value', $(this).val());
});
//Change slider when input is changed
elements.degrees.value.change(function(){
    elements.degrees.slider('value', $(this).val());
});
//Change slider when input is changed
elements.speed.value.change(function(){
    elements.speed.slider('value', $(this).val());
});
//Change slider when input is changed
elements.perspective.value.change(function(){
    elements.perspective.slider('value', $(this).val());
});

module.exports = elements;

},{}],5:[function(require,module,exports){
var playlist = function(dom, audio, timing) {

    var trackNumber = 0;
    var startMs = 0;
    var ended = false;

    var handle = this;
    this.startAnimation = function(data) {
        dom.startAnimation(function() {
            handle.showNewTrack(data);
        });
    };
    this.showNewTrack = function(data) {
        var track = data[trackNumber];
        var genre = track.genre.split('.')[0] - 1;
        dom.setTrackInfo(data.length - trackNumber - 2, track.ytTitle, track.name);
        dom.changeTheme(genre);
        dom.showNewTrack(genre, function(){
            handle.reverseAnimation(data, track);
        });
    };
    this.reverseAnimation = function(data, track) {
        dom.reverseAnimation(function() {
            handle.synchronize(data, track);
        });
    };
    this.synchronize = function(data, track) {
        var totalDuration = 0;
        for (var i = trackNumber; i < data.length-1; i++) {
            totalDuration += data[i].duration;
        }
        totalDuration = totalDuration + 12000*(i - trackNumber - 2); //5 seconds between songs

        if (timing.getRemainingMs() > totalDuration)
            setTimeout(function() {
                handle.synchronize(data, track);
            }, 1000);
        else
            handle.playNextSong(data, track);
    };
    this.playNextSong = function(data, track) {
        audio.play(track.src, function() {
            handle.songEnded(data);
        });
    };
    this.songEnded = function(data) {
        audio.pause();
        trackNumber++;
        if (trackNumber + 2 < data.length) handle.startAnimation(data);
        else handle.lastSong(data);
    };
    this.lastSong = function(data){
        if (ended) {
            handle.playNextSong(data, data[data.length - 1]);
            dom.hideTimer();
        } else {
            ended = true;
            dom.setFinalCountdown();
            handle.playNextSong(data, data[data.length - 2]);
        }
    };



    this.progress = function(data, callback) {
        if(ended) return false;
        var dur = data[trackNumber].duration,
            cur = audio.getTime() * 1000, //Seconds to miliseconds
            percentage = (cur / dur) * 100;
        if (callback) callback(percentage);
    };
    this.setNavigation = function(data) {
        dom.admin.previous.click(function(){
            handle.playPrevious(data);
        });
        dom.admin.play.click(function(){
            handle.playCurrent(data);
        });
        dom.admin.next.click(function(){
            handle.playNext(data);
        });
    };
    this.playPrevious = function (data) {
        if(trackNumber > 0) {
            trackNumber -= 2;
            handle.songEnded(data);
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
    this.playCurrent = function (data) {
        if (audio.isPlaying()) {
            audio.pause();
            dom.admin.play.removeClass("fa-pause");
            dom.admin.play.addClass("fa-play");
        } else {
            audio.unpause();
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
    };
    this.playNext = function (data) {
        if (data.length > trackNumber + 1) {
            handle.songEnded(data);
            dom.admin.play.removeClass("fa-play");
            dom.admin.play.addClass("fa-pause");
        }
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
timing.deadline = '2015-12-31 15:23:55'; //00:00 is important for timezone
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
    return timing.getRemaining().total;
};
var lastSecond = timing.getRemaining().seconds;
timing.clock = function(callback) {
    var rem = timing.getRemaining();
    var curSecond = rem.seconds;
    if(curSecond !== lastSecond){
        var obj = {};
        obj.t = rem.total;
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
