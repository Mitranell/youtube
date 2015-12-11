var mediaCore = require('./media.js'),
    media = new mediaCore();

var wrapper = function(express, app) {

    app.get('/convert', function(req, res) {
        media.getSheet(function(data) {

            var i = {};
            i.array = 0;
            i.tracks = 1;

            var rows = data.length;

            function execute() {
                var url = data[i.array]['track' + i.tracks.toString() + 'youtubeurl'];
                var name = data[i.array].jouwnaam;
                var genre = data[i.array]['track' + i.tracks.toString() + 'genre'];

                console.log('url: '+url);
                console.log('name: '+name);
                console.log('genre: '+genre);

                media.convert(url, name, genre, function() {
                    if(i.tracks < 3){
                        i.tracks ++;
                        execute();
                    } else if(i.array < rows-1){
                        i.array ++;
                        i.tracks = 1;
                        execute();
                    } else if(i.array == rows-1){
                        res.send('Done converting '+rows+' rows of songs, for a total of '+rows*3+' tracks :)')
                    }
                });
            } execute();
        });
    });
};
module.exports = wrapper;
