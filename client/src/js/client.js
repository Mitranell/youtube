var timing = require('./timing.js');
var ui = require('./ui.js');
var audio = require('./audio.js');
var track = require('./track.js');

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
                    if (callback) callback(content);
                }
            }
        };
        rawFile.send(null);
    };

    //Starting it all
    tool.readFile('../client/tracks/tracklist.txt', function(data) {
        data = data.split(',');
        track.getInfo(data);
        audio.startPlaylist(data);
        ui.render();
    });
    ui.resize();
