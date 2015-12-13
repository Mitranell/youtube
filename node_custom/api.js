var fs = require('fs'), //Filesystem
    mediaCore = require('./media.js'),
    media = new mediaCore();

var api = function(express, app) {

    app.get('/convert', function(req, res) {
        media.getSheet(function(data) {

            var rows = data.length;

            var i = {};
            i.array = 0;
            i.tracks = 1;

            var trackList = [];

            var track = {};
            track.list = [];
            track.writeListFile = function(listString, callback) {
                fs.writeFile("./client/tracks/tracklist.txt", listString, function(err) {
                    if (err) return console.log(err);
                    console.log("The tracklistFile was saved!");
                    if(callback) callback();
                });
            };

            function execute() {
                var url = data[i.array]['track' + i.tracks.toString() + 'youtubeurl'];
                var name = data[i.array].jouwnaam;
                var genre = data[i.array]['track' + i.tracks.toString() + 'genre'];

                console.log('url: ' + url);
                console.log('name: ' + name);
                console.log('genre: ' + genre);

                media.convert(url, name, genre, function(data) {
                    trackList.push(data);
                    if (i.tracks < 3) {
                        i.tracks++;
                        execute();
                    } else if (i.array < rows - 1) {
                        i.array++;
                        i.tracks = 1;
                        execute();
                    } else if (i.array == rows - 1) {
                        console.log('TrackList:')
                        console.log(trackList);
                        track.writeListFile(trackList.join(","), function(){
                            res.send(trackList);
                        });
                    }
                });
            }
            execute();


        });
    });
};
module.exports = api;
