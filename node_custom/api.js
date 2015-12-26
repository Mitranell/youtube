var fs = require('fs'), //Filesystem
    mediaCore = require('./media.js'),
    media = new mediaCore(),
    YouTube = require('youtube-node'),
    youtube = new YouTube();
    youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU'),
    moment = require('moment');

var yt = {};
yt.getData = function(id, callback) {
    youtube.getById(id, function(error, result) {
        if (error) return console.log(error);
        if (callback) callback(result.items[0]);
    });
};
yt.getID = function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
};
yt.normalize = function(url) {
    var id = yt.getID(url);
    return 'https://www.youtube.com/watch?v=' + id;
};

var api = function(express, app) {

    app.get('/', function(req, res) {
        res.sendFile('index.html', {
            root: __dirname + '/../client'
        });
    });

    app.get('/getTracklist', function(req, res) {
        fs.readFile('client/tracks/tracklist.json', 'utf8', function(err, data) {
            if (err) return console.log(err);
            res.send(data);
        });
    });

    app.get('/convert', function(req, res) {
        media.getSheet(function(data) {
            var rows = data.length;
            var i = {};
            i.array = 0;
            i.tracks = 1;

            var track = {};
            track.list = [];
            track.writeListFile = function(list, callback) {
                fs.writeFile("./client/tracks/tracklist.json", list, function(err) {
                    if (err) return console.log(err);
                    console.log("The tracklistFile was saved!");
                    if (callback) callback();
                });
            };

            function execute() {
                var obj = {};
                obj.url = yt.normalize(data[i.array]['track' + i.tracks.toString() + 'youtubeurl']);
                obj.id = yt.getID(obj.url);
                obj.name = data[i.array].jouwnaam;
                obj.genre = data[i.array]['track' + i.tracks.toString() + 'genre'];

                media.convert(obj.url, obj.id, obj.name, obj.genre, function(data) {
                    obj.src = data;
                    yt.getData(obj.id, function(result) {
                        var title = result.snippet.title;
                        var titleBase64 = new Buffer(title).toString('base64');
                        var videoDuration = result.contentDetails.duration;
                        obj.ytTitle = titleBase64;
                        obj.duration = moment.duration(videoDuration).asMilliseconds(); //Convert encoded Youtube duration to MS using moment

                        track.list.push(obj);
                        if (i.tracks < 3) {
                            i.tracks++;
                            execute();
                        } else if (i.array < rows - 1) {
                            i.array++;
                            i.tracks = 1;
                            execute();
                        } else if (i.array == rows - 1) {
                            track.list.sort(compare);
                            track.writeListFile(JSON.stringify(track.list), function() {
                                res.send(track.list);
                            });
                        }
                    });
                });
            }
            function compare(a,b) {
                if (a.src < b.src)
                    return -1;
                if (a.src > b.src)
                    return 1;
                return 0;
            }
            execute();
        });
    });
};
module.exports = api;
