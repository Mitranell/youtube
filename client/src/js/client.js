(function() {

    var test = {};
    test.track = '1.Hardstyle637Mark van der Pijl.mp3'; //Change to test title in track folder
    test.dir = '../client/tracks/';
    test.src = test.dir + test.track;

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
                    if(callback) callback(content);
                }
            }
        };
        rawFile.send(null);
    };

    var color = {};
    color.bg = '#1e2230';
    color.blue = '#26477d';

    var elements = {};
    elements.theater = $('#theater');
    elements.skull = $('#skull');

    var audio = {};
    audio.audio = new Audio();
    audio.dancer = new Dancer();
    audio.setSrc = function(url) {
        audio.dancer.load({
            'src': url
        });
    };
    audio.startPlaylist = function(trackListArray){
        var src = trackListArray[Math.floor(Math.random()*trackListArray.length)];
        audio.setSrc(test.dir + src);
        audio.play();
    };
    audio.play = function() {
        audio.dancer.play();
    };
    audio.pause = function() {
        audio.dancer.pause();
    };
    audio.setVolume = function(vol) {
        audio.dancer.setVolume(vol); //Volume from 0 to 1
    };
    audio.getSpectrum = function() {
        return audio.dancer.getSpectrum();
    };
    audio.getWaveform = function() {
        return audio.dancer.getWaveform();
    };
    audio.kick = audio.dancer.createKick({
        frequency: [0, 10],
        threshold: 0.5,
        onKick: function(mag) {
            ui.kick();
        },
        offKick: function(mag) {
            ui.noKick();
        }
    });
    audio.kick.on();

    var ui = {};
    ui.c = document.getElementById("canvas");
    ui.ctx = ui.c.getContext("2d");
    ui.resize = function() {
        ui.c.width = w.w();
        ui.c.height = w.h();
    };
    ui.render = function() {
        requestAnimationFrame(ui.render);

        var curMs = timing.getCurMs();

        ui.draw();
    };
    ui.kick = function() {
        console.log('kick');
        TweenLite.to(elements.theater, 0.1, {
            scale: 1.1
        });
    };
    ui.noKick = function() {
        TweenLite.to(elements.theater, 0.4, {
            scale: 1
        });
    };
    ui.draw = function() {
        var spectrum = {};
        spectrum.data = audio.dancer.getSpectrum();
        spectrum.size = spectrum.data.length / 2;
        spectrum.barWidth = (w.w() / spectrum.size) * 2.5;
        x = 0;

        ui.ctx.fillStyle = color.bg;
        ui.ctx.fillRect(0, 0, w.w(), w.h());
        for (var i = 0; i < spectrum.size; i++) {
            spectrum.barHeight = spectrum.data[i] * 1500;
            ui.ctx.fillStyle = color.blue;
            ui.ctx.fillRect(x, w.h() / 2 - spectrum.barHeight / 2, spectrum.barWidth, spectrum.barHeight);
            x += spectrum.barWidth;
        }
    };

    //Starting it all
    tool.readFile(test.dir+'tracklist.txt', function(data){
        data = data.split(',');
        console.log(data);
        audio.startPlaylist(data);
        ui.render();
    });
    ui.resize();

    var timing = {};
    timing.deadline = '2015-12-31';
    timing.getRemaining = function() {
        var t = Date.parse(timing.deadline) - Date.now();
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
    timing.getCurMs = function() {
        return Date.now();
    };
    timing.getRemainingMs = function() {
        return timing.getRemaining().total;
    };
    console.log('CurMs:' + timing.getCurMs());
    console.log('Till deadline:');
    var rem = timing.getRemaining();
    console.log('Days:' + rem.days);
    console.log('hours:' + rem.hours);
    console.log('minutes:' + rem.minutes);
    console.log('seconds:' + rem.seconds);
})();
