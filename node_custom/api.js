var fs = require('fs'), //Filesystem
    mediaCore = require('./media.js'),
    media = new mediaCore(),
    YouTube = require('youtube-node'),
    youtube = new YouTube();
youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

var yt = {};
yt.getName = function(id, callback) {
    youtube.getById(id, function(error, result) {
        if (error) return console.log(error);

        var title = result.items[0].snippet.title;
        var titleBase64 = new Buffer(title).toString('base64');
        if (callback) callback(titleBase64);
    });
};
yt.getID = function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
};
//Normalize any format to the generic video url. (Built because mobile urls caused problems)
yt.normalize = function(url) {
    var id = tool.getYTID(url);
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

            var trackList = [];

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
                var url = data[i.array]['track' + i.tracks.toString() + 'youtubeurl'];
                url = yt.normalize(url);
                var id = yt.getID(url);
                var name = data[i.array].jouwnaam;
                var genre = data[i.array]['track' + i.tracks.toString() + 'genre'];

                console.log('url: ' + url);
                console.log('name: ' + name);
                console.log('genre: ' + genre);

                media.convert(url, id, name, genre, function(data) {
                    var obj = {};
                    obj.url = url;
                    obj.id = id;
                    obj.name = name;
                    obj.genre = genre;
                    obj.src = data;

                    yt.getName(obj.id, function(titleBase64) {
                        obj.ytTitle = titleBase64;
                        trackList.push(obj);

                        if (i.tracks < 3) {
                            i.tracks++;
                            execute();
                        } else if (i.array < rows - 1) {
                            i.array++;
                            i.tracks = 1;
                            execute();
                        } else if (i.array == rows - 1) {
                            track.writeListFile(JSON.stringify(trackList), function() {
                                res.send(trackList);
                            });
                        }
                    });
                });
            }
            execute();
        });
    });
};
module.exports = api;
