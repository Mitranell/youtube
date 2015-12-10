var mediaCore = require('./media.js'),
    media = new mediaCore();

var wrapper = function(express, app) {

    app.get('/convert', function(req, res) {
        media.getSheet(function(data) {

            var i = {};
            i.array = 0;
            i.tracks = 1;

            function execute() {
                var url = data[i.array]['track' + i.tracks.toString() + 'youtubeurl'];
                var name = data[i.array].jouwnaam;
                var genre = data[i.array]['track' + i.tracks.toString() + 'genre'];

                media.convert(url, name, genre, function() {
                    if(i.tracks < 3){
                        i.tracks ++;
                        execute();
                    } else if(i.array < data.length){
                        i.array ++;
                        i.tracks = 0;
                        execute();
                    }
                });
            } execute();
        });
    });
};
module.exports = wrapper;
